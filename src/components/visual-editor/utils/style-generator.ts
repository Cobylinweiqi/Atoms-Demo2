// ═══════════════════════════════════════════════════════════════
// 样式生成器 — ComponentStyles → React.CSSProperties
// ═══════════════════════════════════════════════════════════════

import type { CSSProperties } from "react";
import type { ComponentStyles, SpacingBox, ShadowValue } from "@/components/visual-editor/types";

// ─── SpacingBox → CSS string ───
function boxToCss(box: SpacingBox | undefined): string | undefined {
  if (!box) return undefined;
  return `${box.top} ${box.right} ${box.bottom} ${box.left}`;
}

// ─── ShadowValue → CSS string ───
function shadowToCss(shadow: ShadowValue | undefined): string | undefined {
  if (!shadow) return undefined;
  return `${shadow.inset ? "inset " : ""}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
}

// ─── borderRadius 处理 (string 或 SpacingBox) ───
function radiusToCss(
  radius: SpacingBox | string | undefined
): string | undefined {
  if (!radius) return undefined;
  if (typeof radius === "string") return radius;
  return `${radius.top} ${radius.right} ${radius.bottom} ${radius.left}`;
}

/**
 * 将 ComponentStyles 转换为 React 内联样式
 * 忽略 undefined 值，只输出有值的属性
 */
export function stylesToCss(styles: ComponentStyles): CSSProperties {
  const css: CSSProperties = {};

  if (styles.display) css.display = styles.display;
  if (styles.flexDirection) css.flexDirection = styles.flexDirection;
  if (styles.justifyContent) css.justifyContent = styles.justifyContent;
  if (styles.alignItems) css.alignItems = styles.alignItems;
  if (styles.flexWrap) css.flexWrap = styles.flexWrap;
  if (styles.flexGrow !== undefined) css.flexGrow = styles.flexGrow;
  if (styles.flexShrink !== undefined) css.flexShrink = styles.flexShrink;
  if (styles.flexBasis) css.flexBasis = styles.flexBasis;
  if (styles.gap) css.gap = styles.gap;

  if (styles.gridTemplateColumns) css.gridTemplateColumns = styles.gridTemplateColumns;
  if (styles.gridTemplateRows) css.gridTemplateRows = styles.gridTemplateRows;
  if (styles.gridColumnGap) css.columnGap = styles.gridColumnGap;
  if (styles.gridRowGap) css.rowGap = styles.gridRowGap;

  if (styles.width) css.width = styles.width;
  if (styles.height) css.height = styles.height;
  if (styles.minWidth) css.minWidth = styles.minWidth;
  if (styles.minHeight) css.minHeight = styles.minHeight;
  if (styles.maxWidth) css.maxWidth = styles.maxWidth;
  if (styles.maxHeight) css.maxHeight = styles.maxHeight;

  const margin = boxToCss(styles.margin);
  if (margin) css.margin = margin;
  const padding = boxToCss(styles.padding);
  if (padding) css.padding = padding;

  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.fontFamily) css.fontFamily = styles.fontFamily;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textAlign) css.textAlign = styles.textAlign;
  if (styles.textTransform) css.textTransform = styles.textTransform;
  if (styles.textDecoration) css.textDecoration = styles.textDecoration;

  if (styles.color) css.color = styles.color;
  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;

  if (styles.borderWidth) css.borderWidth = styles.borderWidth;
  if (styles.borderStyle) css.borderStyle = styles.borderStyle;
  if (styles.borderColor) css.borderColor = styles.borderColor;

  const radius = radiusToCss(styles.borderRadius);
  if (radius) css.borderRadius = radius;

  const shadow = shadowToCss(styles.boxShadow);
  if (shadow) css.boxShadow = shadow;

  if (styles.opacity !== undefined) css.opacity = styles.opacity;
  if (styles.overflow) css.overflow = styles.overflow;
  if (styles.position) css.position = styles.position;
  if (styles.zIndex !== undefined) css.zIndex = styles.zIndex;
  if (styles.cursor) css.cursor = styles.cursor;

  return css;
}
