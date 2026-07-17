// ═══════════════════════════════════════════════════════════════
// HistoryEntry — 历史记录类型定义
// ═══════════════════════════════════════════════════════════════

import type { ComponentNode } from "./node";

/** 历史操作类型 */
export type HistoryActionType =
  | "add"
  | "delete"
  | "move"
  | "duplicate"
  | "update-props"
  | "update-styles"
  | "toggle-visible"
  | "toggle-lock";

/** 历史记录条目 — 快照模式 */
export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: HistoryActionType;
  label: string;
  nodeId?: string;
  snapshot: ComponentNode[];
}
