// ═══════════════════════════════════════════════════════════════
// ComponentNode — 可视化编辑器组件节点类型
// ═══════════════════════════════════════════════════════════════

/** 组件类型枚举 */
export type NodeType =
  | "Container"
  | "Text"
  | "Button"
  | "Image"
  | "Input"
  | "Card"
  | "Section"
  | "Divider"
  | "Link"
  | "Icon"
  | "Badge";

/** 四方向盒子模型 (margin / padding / borderRadius) */
export interface SpacingBox {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

/** 阴影值 */
export interface ShadowValue {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

/** 组件样式定义 — 覆盖所有可编辑属性 */
export interface ComponentStyles {
  // — Layout —
  display?: "block" | "flex" | "grid" | "inline" | "inline-flex" | "none";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  gap?: string;

  // — Grid —
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumnGap?: string;
  gridRowGap?: string;

  // — Size —
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  // — Spacing —
  margin?: SpacingBox;
  padding?: SpacingBox;

  // — Typography —
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";

  // — Color —
  color?: string;
  backgroundColor?: string;

  // — Border —
  borderWidth?: string;
  borderStyle?: "none" | "solid" | "dashed" | "dotted";
  borderColor?: string;

  // — Radius —
  borderRadius?: SpacingBox | string;

  // — Shadow —
  boxShadow?: ShadowValue;

  // — Other —
  opacity?: number;
  overflow?: "visible" | "hidden" | "auto" | "scroll";
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  zIndex?: number;
  cursor?: string;
}

/** 组件节点 */
export interface ComponentNode {
  id: string;
  type: NodeType;
  name: string;
  children: ComponentNode[];
  props: Record<string, unknown>;
  styles: ComponentStyles;
  visible: boolean;
  locked: boolean;
}
