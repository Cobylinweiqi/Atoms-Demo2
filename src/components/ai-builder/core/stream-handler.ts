// ═══════════════════════════════════════════════════════════════
// Stream Handler — Streaming 响应处理器
// 职责: 解析 SSE 流 / 分发事件 / 支持 Stop / 重连
// 架构: 基于 ReadableStream + AbortController
// ═══════════════════════════════════════════════════════════════

import type { StreamEvent, StreamEventType } from "../types";

// ─── 回调函数类型 ───
export type StreamCallback = (event: StreamEvent) => void;
export type ErrorCallback = (error: Error) => void;
export type DoneCallback = () => void;

// ─── 流式请求配置 ───
export interface StreamRequestConfig {
  url: string;
  systemPrompt: string;
  userPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════
// StreamHandler
// ═══════════════════════════════════════════════════════════════

export class StreamHandler {
  protected controller: AbortController | null = null;
  protected isStreaming: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnects: number = 3;

  // ─── 启动流式请求 ───
  async stream(
    config: StreamRequestConfig,
    callbacks: {
      onEvent: StreamCallback;
      onError?: ErrorCallback;
      onDone?: DoneCallback;
    },
  ): Promise<void> {
    this.controller = new AbortController();
    this.isStreaming = true;
    this.reconnectAttempts = 0;

    try {
      await this.doStream(config, callbacks);
    } catch (err) {
      if (this.isStreaming && err instanceof DOMException && err.name === "AbortError") {
        // 用户主动 Stop, 不算错误
        callbacks.onEvent({
          type: "done",
          data: {},
        });
      } else if (this.isStreaming && this.reconnectAttempts < this.maxReconnects) {
        // 自动重连
        this.reconnectAttempts++;
        await this.delay(1000 * this.reconnectAttempts);
        await this.doStream(config, callbacks);
      } else {
        callbacks.onError?.(err as Error);
      }
    } finally {
      this.isStreaming = false;
      this.controller = null;
      callbacks.onDone?.();
    }
  }

  // ─── 实际流式处理 ───
  private async doStream(
    config: StreamRequestConfig,
    callbacks: { onEvent: StreamCallback; onError?: ErrorCallback },
  ): Promise<void> {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify({
        systemPrompt: config.systemPrompt,
        userPrompt: config.userPrompt,
        model: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        stream: true,
      }),
      signal: this.controller?.signal ?? config.signal,
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 解析 SSE (以 \n\n 分隔事件)
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const rawEvent of events) {
        const parsed = this.parseSSE(rawEvent);
        if (parsed) {
          callbacks.onEvent(parsed);
        }
      }
    }

    // 处理剩余 buffer
    if (buffer.trim()) {
      const parsed = this.parseSSE(buffer);
      if (parsed) callbacks.onEvent(parsed);
    }
  }

  // ─── 解析 SSE 事件 ───
  private parseSSE(raw: string): StreamEvent | null {
    const lines = raw.split("\n");
    let eventType: StreamEventType = "text_delta";
    let dataStr = "";

    for (const line of lines) {
      if (line.startsWith("event:")) {
        eventType = line.slice(6).trim() as StreamEventType;
      } else if (line.startsWith("data:")) {
        dataStr += line.slice(5).trim();
      }
    }

    if (!dataStr) return null;

    try {
      const data = JSON.parse(dataStr);
      return { type: eventType, data } as StreamEvent;
    } catch {
      return { type: eventType, data: { text: dataStr } };
    }
  }

  // ─── 停止流 ───
  stop(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
    this.isStreaming = false;
  }

  // ─── 是否正在流式 ───
  get streaming(): boolean {
    return this.isStreaming;
  }

  // ─── 辅助: 延迟 ───
  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════
// MockStreamHandler — 本地模拟流式 (无后端时用于演示)
// ═══════════════════════════════════════════════════════════════

export class MockStreamHandler extends StreamHandler {
  async stream(
    _config: StreamRequestConfig,
    callbacks: {
      onEvent: StreamCallback;
      onError?: ErrorCallback;
      onDone?: DoneCallback;
    },
  ): Promise<void> {
    this.isStreaming = true;
    this.controller = new AbortController();

    try {
      // 1. 思考阶段
      callbacks.onEvent({ type: "thinking_start", data: {} });

      const thinkingText = "Analyzing the request... Looking at the provided context. Determining the best approach for implementation.";
      for (const chunk of this.chunkText(thinkingText, 10)) {
        if (!this.isStreaming) break;
        callbacks.onEvent({ type: "thinking_delta", data: { thinking: chunk } });
        await this.delay(50);
      }
      callbacks.onEvent({ type: "thinking_end", data: {} });

      // 2. 文本回复
      const replyText = "I'll create a React component based on your request. Here's my approach:";
      for (const chunk of this.chunkText(replyText, 8)) {
        if (!this.isStreaming) break;
        callbacks.onEvent({ type: "text_delta", data: { text: chunk } });
        await this.delay(40);
      }
      callbacks.onEvent({ type: "text_end", data: {} });

      // 3. 代码块
      callbacks.onEvent({
        type: "code_start",
        data: { language: "react", filename: "Button.tsx" },
      });
      const code = `export function Button({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-gradient-brand px-6 py-3 text-white shadow-glow transition-all hover:-translate-y-0.5"
    >
      {label}
    </button>
  );
}`;
      for (const chunk of this.chunkText(code, 15)) {
        if (!this.isStreaming) break;
        callbacks.onEvent({ type: "code_delta", data: { code: chunk } });
        await this.delay(30);
      }
      callbacks.onEvent({ type: "code_end", data: {} });

      // 4. 完成
      callbacks.onEvent({
        type: "done",
        data: { tokens: { prompt: 350, completion: 180 } },
      });
    } catch (err) {
      callbacks.onError?.(err as Error);
    } finally {
      this.isStreaming = false;
      this.controller = null;
      callbacks.onDone?.();
    }
  }

  private chunkText(text: string, size: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }
}
