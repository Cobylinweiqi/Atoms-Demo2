// ═══════════════════════════════════════════════════════════════
// Agent Runner — Agent 执行引擎
// 职责: Task 编排 / 多步骤执行 / 工具调用 / 错误恢复
// 架构: Planner → Executor → Observer 循环
// ═══════════════════════════════════════════════════════════════

import type {
  AgentConfig,
  AgentStep,
  BuilderTask,
  ContextItem,
  MemoryEntry,
  StreamEvent,
} from "../types";
import { PromptBuilder } from "./prompt-builder";
import { StreamHandler, type StreamCallback } from "./stream-handler";
import { ContextManager } from "./context-manager";

// ─── 生成 ID ───
function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Agent 回调 ───
export interface AgentCallbacks {
  onTaskUpdate: (task: BuilderTask) => void;
  onStepUpdate: (step: AgentStep) => void;
  onStreamEvent: StreamCallback;
  onError: (error: Error) => void;
}

// ═══════════════════════════════════════════════════════════════
// AgentRunner
// ═══════════════════════════════════════════════════════════════

export class AgentRunner {
  private config: AgentConfig;
  private streamHandler: StreamHandler;
  private tasks: Map<string, BuilderTask> = new Map();
  private currentTaskId: string | null = null;
  private isRunning: boolean = false;
  private callbacks: AgentCallbacks | null = null;

  constructor(config: AgentConfig, streamHandler?: StreamHandler) {
    this.config = config;
    this.streamHandler = streamHandler ?? new StreamHandler();
  }

  // ─── 规划任务 (将用户请求拆解为多个 Task) ───
  planTasks(userPrompt: string): BuilderTask[] {
    // 简单启发式: 根据关键词拆分
    const tasks: BuilderTask[] = [];

    // 始终有一个 "analyze" 任务
    tasks.push({
      id: genId("task"),
      title: "Analyze Request",
      description: `Understand the user request: "${userPrompt.slice(0, 100)}..."`,
      status: "queued",
      order: 0,
    });

    // 检测是否涉及代码生成
    if (/component|page|api|route|function|class/i.test(userPrompt)) {
      tasks.push({
        id: genId("task"),
        title: "Generate Code",
        description: "Create or modify code files based on the analysis.",
        status: "queued",
        order: 1,
      });
    }

    // 检测是否涉及数据库
    if (/database|sql|schema|table|query/i.test(userPrompt)) {
      tasks.push({
        id: genId("task"),
        title: "Database Changes",
        description: "Generate SQL schema or migration scripts.",
        status: "queued",
        order: 2,
      });
    }

    // 检测是否涉及样式
    if (/style|css|theme|design|layout/i.test(userPrompt)) {
      tasks.push({
        id: genId("task"),
        title: "Style & Design",
        description: "Apply styles and ensure design system compliance.",
        status: "queued",
        order: 3,
      });
    }

    // 始终有一个 "verify" 任务
    tasks.push({
      id: genId("task"),
      title: "Verify & Summarize",
      description: "Verify the output and provide a summary.",
      status: "queued",
      order: tasks.length,
    });

    // 注册任务
    for (const task of tasks) {
      this.tasks.set(task.id, task);
    }

    return tasks;
  }

  // ─── 执行所有任务 ───
  async run(
    userPrompt: string,
    options: {
      context: ContextManager;
      memory: MemoryEntry[];
      callbacks: AgentCallbacks;
    },
  ): Promise<void> {
    this.callbacks = options.callbacks;
    this.isRunning = true;

    const tasks = this.planTasks(userPrompt);

    // 通知任务创建
    for (const task of tasks) {
      this.callbacks.onTaskUpdate({ ...task });
    }

    // 构建 Prompt
    const contextItems = options.context.getAll();
    const promptBuilder = new PromptBuilder({
      config: this.config,
      contextItems,
      memory: options.memory,
    });
    const systemPrompt = promptBuilder.buildSystemPrompt();

    // 逐个执行任务
    for (const task of tasks) {
      if (!this.isRunning) break; // 被停止

      this.currentTaskId = task.id;
      await this.executeTask(task, systemPrompt, userPrompt);
    }

    this.isRunning = false;
    this.currentTaskId = null;
  }

  // ─── 执行单个任务 ───
  private async executeTask(
    task: BuilderTask,
    systemPrompt: string,
    userPrompt: string,
  ): Promise<void> {
    if (!this.callbacks) return;

    // 标记为运行中
    task.status = "running";
    task.startedAt = Date.now();
    this.callbacks.onTaskUpdate({ ...task });

    // 创建步骤
    const step: AgentStep = {
      id: genId("step"),
      taskId: task.id,
      title: task.title,
      status: "thinking",
      startedAt: Date.now(),
    };
    task.steps = [step];
    this.callbacks.onStepUpdate({ ...step });

    try {
      // 流式请求
      await this.streamHandler.stream(
        {
          url: "/api/ai/builder",
          systemPrompt,
          userPrompt: `[Task: ${task.title}]\n${userPrompt}`,
          model: this.config.model,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
        },
        {
          onEvent: (event: StreamEvent) => {
            // 转发流式事件
            this.callbacks!.onStreamEvent(event);

            // 更新步骤状态
            if (event.type === "thinking_start") {
              step.status = "thinking";
            } else if (event.type === "code_start" || event.type === "text_delta") {
              step.status = "executing";
            } else if (event.type === "done") {
              step.status = "completed";
            } else if (event.type === "error") {
              step.status = "failed";
            }
            step.completedAt = event.type === "done" ? Date.now() : undefined;
            this.callbacks!.onStepUpdate({ ...step });
          },
          onError: (error: Error) => {
            step.status = "failed";
            step.result = error.message;
            this.callbacks!.onStepUpdate({ ...step });
            this.callbacks!.onError(error);
          },
        },
      );

      // 任务完成
      task.status = "completed";
      task.completedAt = Date.now();
      this.callbacks.onTaskUpdate({ ...task });
    } catch (error) {
      task.status = "failed";
      task.error = (error as Error).message;
      task.completedAt = Date.now();
      this.callbacks.onTaskUpdate({ ...task });
      this.callbacks.onError(error as Error);
    }
  }

  // ─── 停止执行 ───
  stop(): void {
    this.isRunning = false;
    this.streamHandler.stop();

    // 标记当前任务为 cancelled
    if (this.currentTaskId) {
      const task = this.tasks.get(this.currentTaskId);
      if (task && task.status === "running") {
        task.status = "cancelled";
        task.completedAt = Date.now();
        this.callbacks?.onTaskUpdate({ ...task });
      }
    }
  }

  // ─── 重试单个任务 ───
  async retryTask(
    taskId: string,
    systemPrompt: string,
    userPrompt: string,
  ): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "queued";
    task.error = undefined;
    task.startedAt = undefined;
    task.completedAt = undefined;
    this.callbacks?.onTaskUpdate({ ...task });

    await this.executeTask(task, systemPrompt, userPrompt);
  }

  // ─── 获取所有任务 ───
  getTasks(): BuilderTask[] {
    return Array.from(this.tasks.values()).sort((a, b) => a.order - b.order);
  }

  // ─── 是否正在运行 ───
  get running(): boolean {
    return this.isRunning;
  }
}
