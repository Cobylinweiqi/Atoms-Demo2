// ═══════════════════════════════════════════════════════════════
// Schema 解析器 — 根据节点类型解析出完整 Schema
// ═══════════════════════════════════════════════════════════════

import type { ComponentSchema, NodeType } from "@/components/visual-editor/types";
import { schemaRegistry } from "@/components/visual-editor/schema";

/**
 * 根据节点类型获取对应的 ComponentSchema
 */
export function resolveSchema(nodeType: NodeType): ComponentSchema {
  const schema = schemaRegistry[nodeType];
  if (!schema) {
    // fallback to Container schema
    return schemaRegistry.Container;
  }
  return schema;
}
