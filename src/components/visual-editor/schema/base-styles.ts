// ═══════════════════════════════════════════════════════════════
// 基础样式 Schema — 所有组件共享的样式属性字段
// ═══════════════════════════════════════════════════════════════

import type { PropertyFieldSchema } from "@/components/visual-editor/types";

export const BASE_STYLE_FIELDS: PropertyFieldSchema[] = [
  // ─── Layout Group ───
  {
    key: "display",
    label: "Display",
    type: "select",
    group: "layout",
    options: [
      { label: "Block", value: "block" },
      { label: "Flex", value: "flex" },
      { label: "Grid", value: "grid" },
      { label: "Inline", value: "inline" },
      { label: "Inline Flex", value: "inline-flex" },
      { label: "None", value: "none" },
    ],
    defaultValue: "block",
  },
  {
    key: "flexDirection",
    label: "Direction",
    type: "select",
    group: "layout",
    options: [
      { label: "Row", value: "row" },
      { label: "Column", value: "column" },
      { label: "Row Reverse", value: "row-reverse" },
      { label: "Column Reverse", value: "column-reverse" },
    ],
    defaultValue: "row",
    visibleWhen: { field: "display", equals: "flex" },
  },
  {
    key: "justifyContent",
    label: "Justify",
    type: "select",
    group: "layout",
    options: [
      { label: "Start", value: "flex-start" },
      { label: "Center", value: "center" },
      { label: "End", value: "flex-end" },
      { label: "Between", value: "space-between" },
      { label: "Around", value: "space-around" },
    ],
    visibleWhen: { field: "display", equals: "flex" },
  },
  {
    key: "alignItems",
    label: "Align",
    type: "select",
    group: "layout",
    options: [
      { label: "Start", value: "flex-start" },
      { label: "Center", value: "center" },
      { label: "End", value: "flex-end" },
      { label: "Stretch", value: "stretch" },
      { label: "Baseline", value: "baseline" },
    ],
    visibleWhen: { field: "display", equals: "flex" },
  },
  {
    key: "flexWrap",
    label: "Wrap",
    type: "select",
    group: "layout",
    options: [
      { label: "No Wrap", value: "nowrap" },
      { label: "Wrap", value: "wrap" },
      { label: "Wrap Reverse", value: "wrap-reverse" },
    ],
    visibleWhen: { field: "display", equals: "flex" },
  },
  {
    key: "gap",
    label: "Gap",
    type: "text",
    group: "layout",
    placeholder: "16px",
    visibleWhen: { field: "display", equals: "flex" },
  },
  {
    key: "gridTemplateColumns",
    label: "Grid Columns",
    type: "code",
    group: "layout",
    placeholder: "repeat(3, 1fr)",
    visibleWhen: { field: "display", equals: "grid" },
  },
  {
    key: "gridTemplateRows",
    label: "Grid Rows",
    type: "code",
    group: "layout",
    placeholder: "auto",
    visibleWhen: { field: "display", equals: "grid" },
  },
  {
    key: "gridColumnGap",
    label: "Column Gap",
    type: "text",
    group: "layout",
    placeholder: "16px",
    visibleWhen: { field: "display", equals: "grid" },
  },
  {
    key: "gridRowGap",
    label: "Row Gap",
    type: "text",
    group: "layout",
    placeholder: "16px",
    visibleWhen: { field: "display", equals: "grid" },
  },

  // ─── Size Group ───
  {
    key: "width",
    label: "Width",
    type: "text",
    group: "size",
    placeholder: "auto",
  },
  {
    key: "height",
    label: "Height",
    type: "text",
    group: "size",
    placeholder: "auto",
  },
  {
    key: "minWidth",
    label: "Min Width",
    type: "text",
    group: "size",
    placeholder: "auto",
  },
  {
    key: "minHeight",
    label: "Min Height",
    type: "text",
    group: "size",
    placeholder: "auto",
  },
  {
    key: "maxWidth",
    label: "Max Width",
    type: "text",
    group: "size",
    placeholder: "none",
  },
  {
    key: "maxHeight",
    label: "Max Height",
    type: "text",
    group: "size",
    placeholder: "none",
  },

  // ─── Spacing Group ───
  {
    key: "margin",
    label: "Margin",
    type: "box",
    group: "spacing",
    box: true,
  },
  {
    key: "padding",
    label: "Padding",
    type: "box",
    group: "spacing",
    box: true,
  },

  // ─── Typography Group ───
  {
    key: "fontSize",
    label: "Font Size",
    type: "text",
    group: "typography",
    placeholder: "16px",
  },
  {
    key: "fontWeight",
    label: "Font Weight",
    type: "select",
    group: "typography",
    options: [
      { label: "Regular (400)", value: "400" },
      { label: "Medium (500)", value: "500" },
      { label: "Semibold (600)", value: "600" },
      { label: "Bold (700)", value: "700" },
    ],
  },
  {
    key: "fontFamily",
    label: "Font Family",
    type: "text",
    group: "typography",
    placeholder: "Inter, sans-serif",
  },
  {
    key: "lineHeight",
    label: "Line Height",
    type: "text",
    group: "typography",
    placeholder: "1.6",
  },
  {
    key: "letterSpacing",
    label: "Letter Spacing",
    type: "text",
    group: "typography",
    placeholder: "0em",
  },
  {
    key: "textAlign",
    label: "Text Align",
    type: "select",
    group: "typography",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
      { label: "Justify", value: "justify" },
    ],
  },
  {
    key: "textTransform",
    label: "Text Transform",
    type: "select",
    group: "typography",
    options: [
      { label: "None", value: "none" },
      { label: "Uppercase", value: "uppercase" },
      { label: "Lowercase", value: "lowercase" },
      { label: "Capitalize", value: "capitalize" },
    ],
  },
  {
    key: "textDecoration",
    label: "Text Decoration",
    type: "select",
    group: "typography",
    options: [
      { label: "None", value: "none" },
      { label: "Underline", value: "underline" },
      { label: "Line Through", value: "line-through" },
    ],
  },

  // ─── Colors Group ───
  {
    key: "color",
    label: "Text Color",
    type: "color",
    group: "colors",
  },
  {
    key: "backgroundColor",
    label: "Background",
    type: "color",
    group: "colors",
  },

  // ─── Border Group ───
  {
    key: "borderWidth",
    label: "Border Width",
    type: "text",
    group: "border",
    placeholder: "0px",
  },
  {
    key: "borderStyle",
    label: "Border Style",
    type: "select",
    group: "border",
    options: [
      { label: "None", value: "none" },
      { label: "Solid", value: "solid" },
      { label: "Dashed", value: "dashed" },
      { label: "Dotted", value: "dotted" },
    ],
  },
  {
    key: "borderColor",
    label: "Border Color",
    type: "color",
    group: "border",
  },
  {
    key: "borderRadius",
    label: "Border Radius",
    type: "box",
    group: "border",
    box: true,
  },

  // ─── Effects Group ───
  {
    key: "boxShadow",
    label: "Box Shadow",
    type: "shadow",
    group: "effects",
  },
  {
    key: "opacity",
    label: "Opacity",
    type: "slider",
    group: "effects",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 1,
  },
  {
    key: "overflow",
    label: "Overflow",
    type: "select",
    group: "effects",
    options: [
      { label: "Visible", value: "visible" },
      { label: "Hidden", value: "hidden" },
      { label: "Auto", value: "auto" },
      { label: "Scroll", value: "scroll" },
    ],
  },
  {
    key: "position",
    label: "Position",
    type: "select",
    group: "effects",
    options: [
      { label: "Static", value: "static" },
      { label: "Relative", value: "relative" },
      { label: "Absolute", value: "absolute" },
      { label: "Fixed", value: "fixed" },
      { label: "Sticky", value: "sticky" },
    ],
  },
];
