// ═══════════════════════════════════════════════════════════════
// 组件专属 Schema 定义 — 每种组件类型的特有属性
// ═══════════════════════════════════════════════════════════════

import type { ComponentSchema } from "@/components/visual-editor/types";
import { PROPERTY_GROUPS } from "./groups";
import { BASE_STYLE_FIELDS } from "./base-styles";

// ─── 辅助: 创建默认四方向间距 ───
function box(top = "0px", right = "0px", bottom = "0px", left = "0px") {
  return { top, right, bottom, left };
}

function shadow(x = 0, y = 0, blur = 0, spread = 0, color = "hsl(var(--foreground) / 0)", inset = false) {
  return { x, y, blur, spread, color, inset };
}

// ═══════════════════════════════════════════════════════════════
// Container
// ═══════════════════════════════════════════════════════════════
const ContainerSchema: ComponentSchema = {
  type: "Container",
  label: "Container",
  icon: "Square",
  groups: PROPERTY_GROUPS,
  fields: BASE_STYLE_FIELDS,
  defaultProps: {},
  defaultStyles: {
    display: "flex",
    flexDirection: "column",
    padding: box("16px", "16px", "16px", "16px"),
    gap: "12px",
    backgroundColor: "hsl(var(--foreground) / 0.02)",
    borderRadius: "12px",
    minHeight: "48px",
  },
  canHaveChildren: true,
};

// ═══════════════════════════════════════════════════════════════
// Section
// ═══════════════════════════════════════════════════════════════
const SectionSchema: ComponentSchema = {
  type: "Section",
  label: "Section",
  icon: "LayoutGrid",
  groups: PROPERTY_GROUPS,
  fields: BASE_STYLE_FIELDS,
  defaultProps: {},
  defaultStyles: {
    display: "flex",
    flexDirection: "column",
    padding: box("64px", "32px", "64px", "32px"),
    gap: "24px",
    width: "100%",
    minHeight: "200px",
  },
  canHaveChildren: true,
};

// ═══════════════════════════════════════════════════════════════
// Text
// ═══════════════════════════════════════════════════════════════
const TextSchema: ComponentSchema = {
  type: "Text",
  label: "Text",
  icon: "Type",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "text",
      label: "Text Content",
      type: "textarea",
      group: "content",
      placeholder: "Enter text...",
      defaultValue: "Text",
    },
    {
      key: "tag",
      label: "HTML Tag",
      type: "select",
      group: "content",
      options: [
        { label: "Paragraph (p)", value: "p" },
        { label: "Heading 1 (h1)", value: "h1" },
        { label: "Heading 2 (h2)", value: "h2" },
        { label: "Heading 3 (h3)", value: "h3" },
        { label: "Heading 4 (h4)", value: "h4" },
        { label: "Span", value: "span" },
        { label: "Label", value: "label" },
      ],
      defaultValue: "p",
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    text: "Edit this text",
    tag: "p",
  },
  defaultStyles: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "hsl(var(--foreground))",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Button
// ═══════════════════════════════════════════════════════════════
const ButtonSchema: ComponentSchema = {
  type: "Button",
  label: "Button",
  icon: "MousePointerClick",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "text",
      label: "Button Text",
      type: "text",
      group: "content",
      defaultValue: "Click Me",
    },
    {
      key: "variant",
      label: "Variant",
      type: "select",
      group: "content",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Ghost", value: "ghost" },
        { label: "Outline", value: "outline" },
      ],
      defaultValue: "primary",
    },
    {
      key: "size",
      label: "Size",
      type: "select",
      group: "content",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
      defaultValue: "md",
    },
    {
      key: "disabled",
      label: "Disabled",
      type: "toggle",
      group: "content",
      defaultValue: false,
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    text: "Click Me",
    variant: "primary",
    size: "md",
    disabled: false,
  },
  defaultStyles: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: box("0px", "24px", "0px", "24px"),
    height: "44px",
    fontSize: "15px",
    fontWeight: "500",
    color: "hsl(var(--primary-foreground))",
    backgroundColor: "hsl(var(--primary))",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: shadow(0, 0, 40, 0, "hsl(var(--primary) / 0.30)"),
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Image
// ═══════════════════════════════════════════════════════════════
const ImageSchema: ComponentSchema = {
  type: "Image",
  label: "Image",
  icon: "Image",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "src",
      label: "Image URL",
      type: "text",
      group: "content",
      placeholder: "https://...",
      defaultValue: "",
    },
    {
      key: "alt",
      label: "Alt Text",
      type: "text",
      group: "content",
      placeholder: "Description...",
    },
    {
      key: "fit",
      label: "Object Fit",
      type: "select",
      group: "content",
      options: [
        { label: "Cover", value: "cover" },
        { label: "Contain", value: "contain" },
        { label: "Fill", value: "fill" },
        { label: "None", value: "none" },
      ],
      defaultValue: "cover",
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    src: "https://via.placeholder.com/400x300/11111A/71717A?text=Image", // placeholder image URL, not a theme color
    alt: "Placeholder",
    fit: "cover",
  },
  defaultStyles: {
    width: "100%",
    height: "200px",
    borderRadius: "12px",
    overflow: "hidden",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Input
// ═══════════════════════════════════════════════════════════════
const InputSchema: ComponentSchema = {
  type: "Input",
  label: "Input",
  icon: "TextCursor",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "placeholder",
      label: "Placeholder",
      type: "text",
      group: "content",
      defaultValue: "Enter text...",
    },
    {
      key: "type",
      label: "Input Type",
      type: "select",
      group: "content",
      options: [
        { label: "Text", value: "text" },
        { label: "Email", value: "email" },
        { label: "Password", value: "password" },
        { label: "Number", value: "number" },
        { label: "Search", value: "search" },
      ],
      defaultValue: "text",
    },
    {
      key: "disabled",
      label: "Disabled",
      type: "toggle",
      group: "content",
      defaultValue: false,
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    placeholder: "Enter text...",
    type: "text",
    disabled: false,
  },
  defaultStyles: {
    width: "100%",
    height: "44px",
    padding: box("0px", "16px", "0px", "16px"),
    fontSize: "15px",
    color: "hsl(var(--foreground))",
    backgroundColor: "hsl(var(--foreground) / 0.03)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "hsl(var(--foreground) / 0.08)",
    borderRadius: "12px",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Card
// ═══════════════════════════════════════════════════════════════
const CardSchema: ComponentSchema = {
  type: "Card",
  label: "Card",
  icon: "CreditCard",
  groups: PROPERTY_GROUPS,
  fields: BASE_STYLE_FIELDS,
  defaultProps: {},
  defaultStyles: {
    display: "flex",
    flexDirection: "column",
    padding: box("24px", "24px", "24px", "24px"),
    gap: "16px",
    backgroundColor: "hsl(var(--foreground) / 0.03)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "hsl(var(--foreground) / 0.06)",
    borderRadius: "var(--radius-2xl)",
    boxShadow: shadow(0, 8, 32, 0, "hsl(var(--foreground) / 0.24)"),
  },
  canHaveChildren: true,
};

// ═══════════════════════════════════════════════════════════════
// Divider
// ═══════════════════════════════════════════════════════════════
const DividerSchema: ComponentSchema = {
  type: "Divider",
  label: "Divider",
  icon: "Minus",
  groups: PROPERTY_GROUPS,
  fields: BASE_STYLE_FIELDS,
  defaultProps: {},
  defaultStyles: {
    width: "100%",
    height: "1px",
    backgroundColor: "hsl(var(--foreground) / 0.08)",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Link
// ═══════════════════════════════════════════════════════════════
const LinkSchema: ComponentSchema = {
  type: "Link",
  label: "Link",
  icon: "Link",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "text",
      label: "Link Text",
      type: "text",
      group: "content",
      defaultValue: "Link",
    },
    {
      key: "href",
      label: "URL",
      type: "text",
      group: "content",
      placeholder: "https://...",
    },
    {
      key: "target",
      label: "Target",
      type: "select",
      group: "content",
      options: [
        { label: "Same Tab", value: "_self" },
        { label: "New Tab", value: "_blank" },
      ],
      defaultValue: "_self",
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    text: "Click here",
    href: "#",
    target: "_self",
  },
  defaultStyles: {
    fontSize: "15px",
    fontWeight: "500",
    color: "hsl(var(--accent) / 0.8)",
    textDecoration: "underline",
    cursor: "pointer",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Badge
// ═══════════════════════════════════════════════════════════════
const BadgeSchema: ComponentSchema = {
  type: "Badge",
  label: "Badge",
  icon: "Tag",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "text",
      label: "Badge Text",
      type: "text",
      group: "content",
      defaultValue: "New",
    },
    {
      key: "variant",
      label: "Variant",
      type: "select",
      group: "content",
      options: [
        { label: "Default", value: "default" },
        { label: "Brand", value: "brand" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
      defaultValue: "default",
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    text: "New",
    variant: "default",
  },
  defaultStyles: {
    display: "inline-flex",
    alignItems: "center",
    padding: box("4px", "12px", "4px", "12px"),
    fontSize: "13px",
    fontWeight: "500",
    color: "hsl(var(--muted-foreground))",
    backgroundColor: "hsl(var(--foreground) / 0.05)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "hsl(var(--foreground) / 0.06)",
    borderRadius: "9999px",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Icon (占位 — 无额外属性)
// ═══════════════════════════════════════════════════════════════
const IconSchema: ComponentSchema = {
  type: "Icon",
  label: "Icon",
  icon: "Star",
  groups: PROPERTY_GROUPS,
  fields: [
    {
      key: "iconName",
      label: "Icon Name",
      type: "text",
      group: "content",
      placeholder: "Star",
      defaultValue: "Star",
    },
    ...BASE_STYLE_FIELDS,
  ],
  defaultProps: {
    iconName: "Star",
  },
  defaultStyles: {
    width: "24px",
    height: "24px",
    color: "hsl(var(--foreground))",
  },
  canHaveChildren: false,
};

// ═══════════════════════════════════════════════════════════════
// Schema 注册中心
// ═══════════════════════════════════════════════════════════════
import type { NodeType } from "@/components/visual-editor/types";

export const schemaRegistry: Record<NodeType, ComponentSchema> = {
  Container: ContainerSchema,
  Section: SectionSchema,
  Text: TextSchema,
  Button: ButtonSchema,
  Image: ImageSchema,
  Input: InputSchema,
  Card: CardSchema,
  Divider: DividerSchema,
  Link: LinkSchema,
  Icon: IconSchema,
  Badge: BadgeSchema,
};

// ─── 可创建组件列表 (用于组件面板) ───
export const CREATABLE_COMPONENTS = Object.values(schemaRegistry).map((s) => ({
  type: s.type,
  label: s.label,
  icon: s.icon,
  canHaveChildren: s.canHaveChildren,
}));
