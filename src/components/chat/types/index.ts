// ═══════════════════════════════════════════════════════════════
// AI Chat Workspace — 类型定义
// ═══════════════════════════════════════════════════════════════

// ─── 消息角色 ───
export type MessageRole = "user" | "assistant" | "system";

// ─── 消息内容块类型 ───
export type ContentBlockType =
  | "text"           // 纯文本 / Markdown
  | "code"           // 代码块
  | "diff"           // Diff 对比
  | "thinking"       // 思考过程
  | "artifact"       // Artifact (代码产物)
  | "image"          // 图片
  | "file"           // 文件附件
  | "tool_call"      // 工具调用
  | "tool_result";   // 工具返回结果

// ─── 流式状态 ───
export type StreamState = "idle" | "streaming" | "thinking" | "done" | "error";

// ─── 基础内容块 ───
export interface BaseContentBlock {
  id: string;
  type: ContentBlockType;
}

// ─── 文本块 (Markdown) ───
export interface TextBlock extends BaseContentBlock {
  type: "text";
  content: string;
}

// ─── 代码块 ───
export interface CodeBlock extends BaseContentBlock {
  type: "code";
  language: string;
  code: string;
  filename?: string;
}

// ─── Diff 块 ───
export interface DiffBlock extends BaseContentBlock {
  type: "diff";
  language: string;
  filename?: string;
  oldContent: string;
  newContent: string;
}

// ─── 思考块 ───
export interface ThinkingBlock extends BaseContentBlock {
  type: "thinking";
  content: string;
  duration?: number; // 思考耗时 (ms)
  collapsed?: boolean;
}

// ─── Artifact 块 (代码产物) ───
export interface ArtifactBlock extends BaseContentBlock {
  type: "artifact";
  title: string;
  type_kind: "application" | "code" | "html" | "svg" | "react";
  language?: string;
  content: string;
  filename?: string;
}

// ─── 图片块 ───
export interface ImageBlock extends BaseContentBlock {
  type: "image";
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// ─── 文件附件块 ───
export interface FileBlock extends BaseContentBlock {
  type: "file";
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
  content?: string; // 文本文件内容
}

// ─── 工具调用块 ───
export interface ToolCallBlock extends BaseContentBlock {
  type: "tool_call";
  toolName: string;
  toolId: string;
  args: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "error";
  result?: unknown;
  error?: string;
  duration?: number;
}

// ─── 联合类型 ───
export type ContentBlock =
  | TextBlock
  | CodeBlock
  | DiffBlock
  | ThinkingBlock
  | ArtifactBlock
  | ImageBlock
  | FileBlock
  | ToolCallBlock;

// ─── 消息 ───
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: ContentBlock[];
  createdAt: number;
  model?: string;         // 使用的模型 (assistant)
  streamState?: StreamState;
  tokens?: {              // Token 统计
    prompt: number;
    completion: number;
  };
}

// ─── 对话 ───
export interface Conversation {
  id: string;
  title: string;
  projectId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

// ─── 项目 ───
export interface Project {
  id: string;
  name: string;
  description: string;
  framework: string;
  status: "active" | "archived";
  lastActiveAt: number;
  conversationCount: number;
  thumbnail?: string;
}

// ─── AI 模型 ───
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon?: string;
  contextWindow: number;
  capabilities: string[]; // ["streaming", "function_calling", "vision"]
}
