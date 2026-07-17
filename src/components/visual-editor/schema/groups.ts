// ═══════════════════════════════════════════════════════════════
// 属性分组定义 — 对应 Properties Panel 的折叠区域
// ═══════════════════════════════════════════════════════════════

import type { PropertyGroup } from "@/components/visual-editor/types";

export const PROPERTY_GROUPS: PropertyGroup[] = [
  {
    id: "content",
    label: "Content",
    icon: "Type",
    order: 0,
    defaultOpen: true,
  },
  {
    id: "layout",
    label: "Layout",
    icon: "LayoutGrid",
    order: 1,
    defaultOpen: true,
  },
  {
    id: "size",
    label: "Size",
    icon: "Maximize2",
    order: 2,
    defaultOpen: false,
  },
  {
    id: "spacing",
    label: "Spacing",
    icon: "Move",
    order: 3,
    defaultOpen: false,
  },
  {
    id: "typography",
    label: "Typography",
    icon: "Type",
    order: 4,
    defaultOpen: false,
  },
  {
    id: "colors",
    label: "Colors",
    icon: "Palette",
    order: 5,
    defaultOpen: true,
  },
  {
    id: "border",
    label: "Border",
    icon: "Square",
    order: 6,
    defaultOpen: false,
  },
  {
    id: "effects",
    label: "Effects",
    icon: "Sparkles",
    order: 7,
    defaultOpen: false,
  },
];
