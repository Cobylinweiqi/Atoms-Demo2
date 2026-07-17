// ═══════════════════════════════════════════════════════════════
// AI Builder — 类型定义
// 支撑 Prompt / Streaming / Agent / Context / Memory / Conversation /
//          Task / File / Image / Code / Diff / Regenerate / Continue /
//          Stop / Retry / Accept / Reject
// ═══════════════════════════════════════════════════════════════

// ─── 输出语言 ───
export type OutputLanguage =
  | "react"
  | "html"
  | "css"
  | "sql"
  | "markdown"
  | "typescript"
  | "javascript"
  | "json";

// ─── 输出块类型 ───
export type OutputBlockType =
  | "text"
  | "thinking"
  | "code"
  | "file_change"
  | "image"
  | "task_update"
  | "error";

// ─── 文件变更动作 ───
export type FileChangeAction = "create" | "modify" | "delete";

// ─── 文件变更状态 (Accept/Reject) ───
export type FileChangeStatus = "pending" | "accepted" | "rejected";

// ─── 任务状态 ───
export type TaskStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

// ─── Agent 步骤状态 ───
export type AgentStepStatus =
  | "pending"
  | "thinking"
  | "executing"
  | "completed"
  | "failed"
  | "skipped";

// ─── 流式状态 ───
export type StreamState =
  | "idle"
  | "connecting"
  | "streaming"
  | "thinking"
  | "tool_calling"
  | "done"
  | "error"
  | "stopped";

// ─── 消息操作类型 ───
export type MessageAction = "send" | "regenerate" | "continue" | "retry";

// ─── Context 类型 ───
export type ContextType =
  | "file"
  | "image"
  | "selection"
  | "url"
  | "memory"
  | "conversation"
  | "codebase";

// ═══════════════════════════════════════════════════════════════
// 基础块
// ═══════════════════════════════════════════════════════════════

export interface BaseBlock {
  id: string;
  type: OutputBlockType;
}

// ─── 文本块 ───
export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

// ─── 思考块 ───
export interface ThinkingBlock extends BaseBlock {
  type: "thinking";
  content: string;
  durationMs?: number;
  collapsed?: boolean;
}

// ─── 代码块 (无文件关联) ───
export interface CodeBlockData extends BaseBlock {
  type: "code";
  language: OutputLanguage;
  code: string;
}

// ─── 文件变更块 (有 Accept/Reject) ───
export interface FileChangeBlock extends BaseBlock {
  type: "file_change";
  filename: string;
  language: OutputLanguage;
  action: FileChangeAction;
  oldContent: string;
  newContent: string;
  diff: string; // unified diff
  status: FileChangeStatus;
  reason?: string; // AI 说明为什么改
}

// ─── 图片块 ───
export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// ─── 任务更新块 ───
export interface TaskUpdateBlock extends BaseBlock {
  type: "task_update";
  taskId: string;
  status: TaskStatus;
  message?: string;
}

// ─── 错误块 ───
export interface ErrorBlock extends BaseBlock {
  type: "error";
  message: string;
  retryable: boolean;
}

// ─── 联合输出块 ───
export type OutputBlock =
  | TextBlock
  | ThinkingBlock
  | CodeBlockData
  | FileChangeBlock
  | ImageBlock
  | TaskUpdateBlock
  | ErrorBlock;

// ═══════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════

export interface ContextItem {
  id: string;
  type: ContextType;
  label: string; // 显示名
  content: string; // 文本内容
  meta?: {
    filename?: string;
    mimeType?: string;
    size?: number;
    startLine?: number;
    endLine?: number;
    language?: OutputLanguage;
  };
}

// ═══════════════════════════════════════════════════════════════
// Memory
// ═══════════════════════════════════════════════════════════════

export type MemoryType =
  | "preference" // 用户偏好
  | "fact" // 项目事实
  | "decision" // 架构决策
  | "snippet" // 代码片段
  | "pattern"; // 设计模式

export interface MemoryEntry {
  id: string;
  type: MemoryType;
  key: string; // 简短描述
  value: string; // 详细内容
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  source?: string; // 来源消息 ID
}

// ═══════════════════════════════════════════════════════════════
// Task
// ═══════════════════════════════════════════════════════════════

export interface BuilderTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  order: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  steps?: AgentStep[]; // 子步骤
}

export interface AgentStep {
  id: string;
  taskId: string;
  title: string;
  status: AgentStepStatus;
  thinking?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  result?: string;
  startedAt?: number;
  completedAt?: number;
}

// ═══════════════════════════════════════════════════════════════
// Message
// ═══════════════════════════════════════════════════════════════

export interface BuilderMessage {
  id: string;
  role: "user" | "assistant" | "system";
  blocks: OutputBlock[];
  createdAt: number;
  streamState: StreamState;
  action?: MessageAction; // 触发此消息的动作
  model?: string;
  tokens?: { prompt: number; completion: number };
  parentId?: string; // regenerate 时指向原消息
  // 上下文快照 (发送时引用的 Context)
  contextIds?: string[];
}

// ═══════════════════════════════════════════════════════════════
// Conversation
// ═══════════════════════════════════════════════════════════════

export interface BuilderConversation {
  id: string;
  title: string;
  projectId: string;
  messages: BuilderMessage[];
  tasks: BuilderTask[];
  memory: MemoryEntry[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

// ═══════════════════════════════════════════════════════════════
// 流式事件 (SSE)
// ═══════════════════════════════════════════════════════════════

export type StreamEventType =
  | "thinking_start"
  | "thinking_delta"
  | "thinking_end"
  | "text_delta"
  | "text_end"
  | "code_start"
  | "code_delta"
  | "code_end"
  | "file_change"
  | "task_update"
  | "error"
  | "done";

export interface StreamEvent {
  type: StreamEventType;
  data: StreamEventData;
}

export type StreamEventData =
  | { thinking?: string } // thinking_delta
  | { text?: string } // text_delta
  | { language?: OutputLanguage; filename?: string; code?: string } // code_*
  | FileChangeBlock // file_change
  | { taskId: string; status: TaskStatus; message?: string } // task_update
  | { message: string; retryable: boolean } // error
  | { tokens?: { prompt: number; completion: number } }; // done

// ═══════════════════════════════════════════════════════════════
// Prompt 模板
// ═══════════════════════════════════════════════════════════════

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  outputLanguage: OutputLanguage;
  variables: PromptVariable[];
}

export interface PromptVariable {
  key: string;
  label: string;
  type: "text" | "code" | "select";
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

// ═══════════════════════════════════════════════════════════════
// Agent 配置
// ═══════════════════════════════════════════════════════════════

export interface AgentConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  maxSteps: number;
  enableThinking: boolean;
  enableFileEdits: boolean;
  enableMemory: boolean;
  systemPrompt?: string;
}

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  model: "claude-sonnet-4-5",
  temperature: 0.3,
  maxTokens: 8192,
  maxSteps: 10,
  enableThinking: true,
  enableFileEdits: true,
  enableMemory: true,
};

// ═══════════════════════════════════════════════════════════════
// 工具定义 (Agent 可用工具)
// ═══════════════════════════════════════════════════════════════

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: "read_file",
    description: "读取项目中的文件内容",
    parameters: { path: { type: "string", description: "文件路径" } },
  },
  {
    name: "write_file",
    description: "创建或修改文件",
    parameters: {
      path: { type: "string", description: "文件路径" },
      content: { type: "string", description: "文件内容" },
    },
  },
  {
    name: "search_codebase",
    description: "在代码库中搜索",
    parameters: {
      query: { type: "string", description: "搜索关键词" },
    },
  },
  {
    name: "run_command",
    description: "执行终端命令",
    parameters: { command: { type: "string", description: "命令" } },
  },
  {
    name: "save_memory",
    description: "保存记忆到 Memory Store",
    parameters: {
      type: { type: "string", description: "Memory 类型" },
      key: { type: "string", description: "简短描述" },
      value: { type: "string", description: "详细内容" },
    },
  },
];
