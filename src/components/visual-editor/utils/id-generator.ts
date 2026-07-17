// ═══════════════════════════════════════════════════════════════
// ID 生成器
// ═══════════════════════════════════════════════════════════════

import { nanoid } from "nanoid";

/** 生成唯一节点 ID */
export function generateNodeId(): string {
  return `node_${nanoid(10)}`;
}

/** 生成唯一历史记录 ID */
export function generateHistoryId(): string {
  return `hist_${nanoid(10)}`;
}
