// ═══════════════════════════════════════════════════════════════
// PropertySchema — JSON Schema 类型定义
// ═══════════════════════════════════════════════════════════════

import type { NodeType, ComponentStyles } from "./node";

/** 字段类型 — 决定渲染哪个输入控件 */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "slider"
  | "color"
  | "select"
  | "toggle"
  | "box"
  | "shadow"
  | "code";

/** 属性分组 */
export interface PropertyGroup {
  id: string;
  label: string;
  icon: string;
  order: number;
  defaultOpen?: boolean;
}

/** 下拉选项 */
export interface SelectOption {
  label: string;
  value: string;
}

/** 字段 Schema — 定义每个可编辑属性的编辑器 */
export interface PropertyFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  group: string;
  defaultValue?: unknown;
  placeholder?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  box?: boolean;
  visibleWhen?: {
    field: string;
    equals: unknown;
  };
}

/** 组件完整 Schema */
export interface ComponentSchema {
  type: NodeType;
  label: string;
  icon: string;
  groups: PropertyGroup[];
  fields: PropertyFieldSchema[];
  defaultProps: Record<string, unknown>;
  defaultStyles: ComponentStyles;
  canHaveChildren: boolean;
}

/** 响应式视口 */
export type Viewport = "desktop" | "tablet" | "mobile";
