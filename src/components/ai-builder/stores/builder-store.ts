// ═══════════════════════════════════════════════════════════════
// Builder Store — AI Builder 核心状态管理 (Zustand)
// 管理: 消息 / 流式 / 任务 / 上下文 / 记忆 / 配置 / 文件变更
// ═══════════════════════════════════════════════════════════════

"use client";

import { create } from "zustand";
import type {
  AgentConfig,
  AgentStep,
  BuilderMessage,
  BuilderTask,
  ContextItem,
  FileChangeBlock,
  FileChangeStatus,
  MemoryEntry,
  OutputBlock,
  OutputLanguage,
  StreamEvent,
  StreamState,
} from "../types";
import { DEFAULT_AGENT_CONFIG } from "../types";
import { AgentRunner } from "../core/agent-runner";
import { MockStreamHandler } from "../core/stream-handler";
import { ContextManager } from "../core/context-manager";
import { getMemoryStore } from "../core/memory-store";
import { PromptBuilder } from "../core/prompt-builder";
import { getCodeGenerator } from "../output/code-generator";

// ─── 生成 ID ───
function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// ═══════════════════════════════════════════════════════════════
// Store 类型
// ═══════════════════════════════════════════════════════════════

interface BuilderStore {
  // ═══ State ═══
  messages: BuilderMessage[];
  tasks: BuilderTask[];
  contextItems: ContextItem[];
  memory: MemoryEntry[];
  config: AgentConfig;
  streamState: StreamState;
  isRunning: boolean;
  currentMessageId: string | null;

  // ═══ 内部实例 (不序列化) ═══
  _agent: AgentRunner | null;
  _contextMgr: ContextManager;
  _memoryStore: ReturnType<typeof getMemoryStore>;

  // ═══ Actions — Messaging ═══
  sendMessage: (prompt: string, action?: "send" | "regenerate" | "continue" | "retry") => Promise<void>;
  stopStreaming: () => void;
  regenerateMessage: (messageId: string) => Promise<void>;
  continueMessage: (messageId: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;

  // ═══ Actions — File Changes ═══
  acceptFileChange: (messageId: string, blockId: string) => void;
  rejectFileChange: (messageId: string, blockId: string) => void;
  acceptAllFileChanges: (messageId: string) => void;
  rejectAllFileChanges: (messageId: string) => void;

  // ═══ Actions — Context ═══
  addContext: (item: Omit<ContextItem, "id">) => void;
  removeContext: (id: string) => void;
  clearContext: () => void;

  // ═══ Actions — Memory ═══
  addMemory: (type: MemoryEntry["type"], key: string, value: string) => void;
  removeMemory: (id: string) => void;
  togglePinMemory: (id: string) => void;
  refreshMemory: () => void;

  // ═══ Actions — Config ═══
  updateConfig: (patch: Partial<AgentConfig>) => void;

  // ═══ Actions — Tasks ═══
  clearTasks: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Store 实现
// ═══════════════════════════════════════════════════════════════

export const useBuilderStore = create<BuilderStore>((set, get) => {
  const contextMgr = new ContextManager();
  const memoryStore = getMemoryStore();

  return {
    // ═══ 初始 State ═══
    messages: [],
    tasks: [],
    contextItems: [],
    memory: memoryStore.getAll(),
    config: DEFAULT_AGENT_CONFIG,
    streamState: "idle",
    isRunning: false,
    currentMessageId: null,
    _agent: null,
    _contextMgr: contextMgr,
    _memoryStore: memoryStore,

    // ═══ sendMessage ═══
    sendMessage: async (prompt, action = "send") => {
      const state = get();
      if (state.isRunning) return;

      // 创建用户消息
      const userMessage: BuilderMessage = {
        id: genId("msg"),
        role: "user",
        blocks: [{ id: genId("blk"), type: "text", content: prompt }],
        createdAt: Date.now(),
        streamState: "done",
        action,
        contextIds: state.contextItems.map((c) => c.id),
      };

      // 创建 assistant 消息 (占位)
      const assistantId = genId("msg");
      const assistantMessage: BuilderMessage = {
        id: assistantId,
        role: "assistant",
        blocks: [],
        createdAt: Date.now(),
        streamState: "connecting",
        action,
        model: state.config.model,
        contextIds: state.contextItems.map((c) => c.id),
      };

      set({
        messages: [...state.messages, userMessage, assistantMessage],
        streamState: "connecting",
        isRunning: true,
        currentMessageId: assistantId,
        tasks: [],
      });

      // 启动 Agent
      const streamHandler = new MockStreamHandler();
      const agent = new AgentRunner(state.config, streamHandler);

      set({ _agent: agent });

      await agent.run(prompt, {
        context: contextMgr,
        memory: state.memory,
        callbacks: {
          onTaskUpdate: (task) => {
            set((s) => {
              const existing = s.tasks.findIndex((t) => t.id === task.id);
              const tasks = [...s.tasks];
              if (existing >= 0) {
                tasks[existing] = task;
              } else {
                tasks.push(task);
              }
              return { tasks };
            });
          },
          onStepUpdate: (_step: AgentStep) => {
            // 步骤更新可以在 TaskPanel 中展示
          },
          onStreamEvent: (event: StreamEvent) => {
            handleStreamEvent(set, get, assistantId, event);
          },
          onError: (error: Error) => {
            set((s) => ({
              streamState: "error",
              isRunning: false,
              currentMessageId: null,
              messages: s.messages.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      streamState: "error",
                      blocks: [
                        ...m.blocks,
                        {
                          id: genId("blk"),
                          type: "error",
                          message: error.message,
                          retryable: true,
                        },
                      ],
                    }
                  : m,
              ),
            }));
          },
        },
      });

      // 完成
      set({
        streamState: "done",
        isRunning: false,
        currentMessageId: null,
      });
    },

    // ═══ stopStreaming ═══
    stopStreaming: () => {
      const state = get();
      state._agent?.stop();
      set({
        streamState: "stopped",
        isRunning: false,
        currentMessageId: null,
        messages: state.messages.map((m) =>
          m.id === state.currentMessageId
            ? { ...m, streamState: "stopped" }
            : m,
        ),
      });
    },

    // ═══ regenerateMessage ═══
    regenerateMessage: async (messageId) => {
      const state = get();
      const message = state.messages.find((m) => m.id === messageId);
      if (!message) return;

      // 找到对应的用户消息
      const msgIndex = state.messages.findIndex((m) => m.id === messageId);
      const userMessage = state.messages[msgIndex - 1];
      if (!userMessage) return;

      const userText = userMessage.blocks
        .filter((b) => b.type === "text")
        .map((b) => (b as { content: string }).content)
        .join("\n");

      // 移除旧的 assistant 消息
      set({
        messages: state.messages.filter((m) => m.id !== messageId),
      });

      // 重新发送
      await get().sendMessage(userText, "regenerate");
    },

    // ═══ continueMessage ═══
    continueMessage: async (messageId) => {
      const state = get();
      const message = state.messages.find((m) => m.id === messageId);
      if (!message) return;

      // 提取已有文本
      const existingText = message.blocks
        .filter((b) => b.type === "text")
        .map((b) => (b as { content: string }).content)
        .join("\n");

      await get().sendMessage(`Continue from:\n${existingText}\n\n[Continue generating]`, "continue");
    },

    // ═══ retryMessage ═══
    retryMessage: async (messageId) => {
      const state = get();
      const message = state.messages.find((m) => m.id === messageId);
      if (!message) return;

      // 找到用户消息
      const msgIndex = state.messages.findIndex((m) => m.id === messageId);
      const userMessage = state.messages[msgIndex - 1];
      if (!userMessage) return;

      const userText = userMessage.blocks
        .filter((b) => b.type === "text")
        .map((b) => (b as { content: string }).content)
        .join("\n");

      // 清空 assistant 消息的 blocks
      set({
        messages: state.messages.map((m) =>
          m.id === messageId
            ? { ...m, blocks: [], streamState: "connecting" }
            : m,
        ),
        streamState: "connecting",
        isRunning: true,
        currentMessageId: messageId,
      });

      // 重新运行
      const streamHandler = new MockStreamHandler();
      const agent = new AgentRunner(state.config, streamHandler);

      set({ _agent: agent });

      await agent.run(userText, {
        context: contextMgr,
        memory: state.memory,
        callbacks: {
          onTaskUpdate: (task) => {
            set((s) => {
              const existing = s.tasks.findIndex((t) => t.id === task.id);
              const tasks = [...s.tasks];
              if (existing >= 0) tasks[existing] = task;
              else tasks.push(task);
              return { tasks };
            });
          },
          onStepUpdate: () => {},
          onStreamEvent: (event: StreamEvent) => {
            handleStreamEvent(set, get, messageId, event);
          },
          onError: (error: Error) => {
            set({ streamState: "error", isRunning: false, currentMessageId: null });
          },
        },
      });

      set({ streamState: "done", isRunning: false, currentMessageId: null });
    },

    // ═══ acceptFileChange ═══
    acceptFileChange: (messageId, blockId) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                blocks: m.blocks.map((b) =>
                  b.id === blockId && b.type === "file_change"
                    ? { ...b, status: "accepted" as FileChangeStatus }
                    : b,
                ),
              }
            : m,
        ),
      }));
    },

    // ═══ rejectFileChange ═══
    rejectFileChange: (messageId, blockId) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                blocks: m.blocks.map((b) =>
                  b.id === blockId && b.type === "file_change"
                    ? { ...b, status: "rejected" as FileChangeStatus }
                    : b,
                ),
              }
            : m,
        ),
      }));
    },

    // ═══ acceptAllFileChanges ═══
    acceptAllFileChanges: (messageId) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                blocks: m.blocks.map((b) =>
                  b.type === "file_change" && b.status === "pending"
                    ? { ...b, status: "accepted" as FileChangeStatus }
                    : b,
                ),
              }
            : m,
        ),
      }));
    },

    // ═══ rejectAllFileChanges ═══
    rejectAllFileChanges: (messageId) => {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId
            ? {
                ...m,
                blocks: m.blocks.map((b) =>
                  b.type === "file_change" && b.status === "pending"
                    ? { ...b, status: "rejected" as FileChangeStatus }
                    : b,
                ),
              }
            : m,
        ),
      }));
    },

    // ═══ Context Actions ═══
    addContext: (item) => {
      const fullItem: ContextItem = { ...item, id: genId("ctx") };
      contextMgr.addFile(item.label, item.content, item.meta);
      set((s) => ({ contextItems: [...s.contextItems, fullItem] }));
    },

    removeContext: (id) => {
      contextMgr.remove(id);
      set((s) => ({ contextItems: s.contextItems.filter((c) => c.id !== id) }));
    },

    clearContext: () => {
      contextMgr.clear();
      set({ contextItems: [] });
    },

    // ═══ Memory Actions ═══
    addMemory: (type, key, value) => {
      memoryStore.add(type, key, value);
      set({ memory: memoryStore.getAll() });
    },

    removeMemory: (id) => {
      memoryStore.remove(id);
      set({ memory: memoryStore.getAll() });
    },

    togglePinMemory: (id) => {
      memoryStore.togglePin(id);
      set({ memory: memoryStore.getAll() });
    },

    refreshMemory: () => {
      set({ memory: memoryStore.getAll() });
    },

    // ═══ Config ═══
    updateConfig: (patch) => {
      set((s) => ({ config: { ...s.config, ...patch } }));
    },

    // ═══ Tasks ═══
    clearTasks: () => set({ tasks: [] }),
  };
});

// ═══════════════════════════════════════════════════════════════
// 流式事件处理 (辅助函数)
// ═══════════════════════════════════════════════════════════════

function handleStreamEvent(
  set: (fn: ((s: BuilderStore) => Partial<BuilderStore>) | Partial<BuilderStore>) => void,
  get: () => BuilderStore,
  messageId: string,
  event: StreamEvent,
) {
  const state = get();
  const message = state.messages.find((m) => m.id === messageId);
  if (!message) return;

  const blocks = [...message.blocks];

  switch (event.type) {
    case "thinking_start": {
      set({ streamState: "thinking" });
      const block: OutputBlock = {
        id: genId("blk"),
        type: "thinking",
        content: "",
      };
      blocks.push(block);
      break;
    }

    case "thinking_delta": {
      const data = event.data as { thinking?: string };
      const lastThinking = [...blocks].reverse().find((b) => b.type === "thinking");
      if (lastThinking && lastThinking.type === "thinking") {
        const idx = blocks.findIndex((b) => b.id === lastThinking.id);
        blocks[idx] = {
          ...lastThinking,
          content: lastThinking.content + (data.thinking ?? ""),
        };
      }
      break;
    }

    case "thinking_end": {
      set({ streamState: "streaming" });
      break;
    }

    case "text_delta": {
      const data = event.data as { text?: string };
      set({ streamState: "streaming" });
      // 找到最后一个 text block, 如果没有则创建
      const lastText = [...blocks].reverse().find((b) => b.type === "text");
      if (lastText && lastText.type === "text") {
        const idx = blocks.findIndex((b) => b.id === lastText.id);
        blocks[idx] = {
          ...lastText,
          content: lastText.content + (data.text ?? ""),
        };
      } else {
        blocks.push({
          id: genId("blk"),
          type: "text",
          content: data.text ?? "",
        });
      }
      break;
    }

    case "text_end": {
      break;
    }

    case "code_start": {
      const data = event.data as { language?: string; filename?: string };
      // 如果有 filename → FileChange, 否则 → CodeBlock
      if (data.filename) {
        // 创建 pending file change
        const block: FileChangeBlock = {
          id: genId("blk"),
          type: "file_change",
          filename: data.filename,
          language: (data.language ?? "typescript") as FileChangeBlock["language"],
          action: "create",
          oldContent: "",
          newContent: "",
          diff: "",
          status: "pending",
        };
        blocks.push(block);
      } else {
        blocks.push({
          id: genId("blk"),
          type: "code",
          language: (data.language ?? "typescript") as OutputLanguage,
          code: "",
        });
      }
      break;
    }

    case "code_delta": {
      const data = event.data as { code?: string; filename?: string };
      // 找到最后一个 code 或 file_change block
      const lastCode = [...blocks].reverse().find(
        (b) => b.type === "code" || b.type === "file_change",
      );
      if (lastCode) {
        const idx = blocks.findIndex((b) => b.id === lastCode.id);
        if (lastCode.type === "code") {
          blocks[idx] = { ...lastCode, code: lastCode.code + (data.code ?? "") };
        } else if (lastCode.type === "file_change") {
          blocks[idx] = {
            ...lastCode,
            newContent: lastCode.newContent + (data.code ?? ""),
          };
        }
      }
      break;
    }

    case "code_end": {
      // 生成 diff for file_change blocks
      const lastFileChange = [...blocks].reverse().find((b) => b.type === "file_change");
      if (lastFileChange && lastFileChange.type === "file_change") {
        const gen = getCodeGenerator();
        const diff = gen.generateUnifiedDiff(
          lastFileChange.oldContent,
          lastFileChange.newContent,
          lastFileChange.filename,
        );
        const idx = blocks.findIndex((b) => b.id === lastFileChange.id);
        blocks[idx] = { ...lastFileChange, diff };
      }
      break;
    }

    case "file_change": {
      const data = event.data as FileChangeBlock;
      blocks.push({ ...data, id: genId("blk") });
      break;
    }

    case "task_update": {
      const data = event.data as { taskId: string; status: string; message?: string };
      blocks.push({
        id: genId("blk"),
        type: "task_update",
        taskId: data.taskId,
        status: data.status as BuilderTask["status"],
        message: data.message,
      });
      break;
    }

    case "error": {
      const data = event.data as { message: string; retryable: boolean };
      blocks.push({
        id: genId("blk"),
        type: "error",
        message: data.message,
        retryable: data.retryable,
      });
      break;
    }

    case "done": {
      const data = event.data as { tokens?: { prompt: number; completion: number } };
      set({
        streamState: "done",
        isRunning: false,
        currentMessageId: null,
      });
      // 更新消息 tokens
      break;
    }
  }

  // 更新消息
  set((s) => ({
    messages: s.messages.map((m) =>
      m.id === messageId ? { ...m, blocks } : m,
    ),
  }));
}
