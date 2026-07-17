"use client";

import React from "react";
import type { PropertyFieldSchema, ComponentNode } from "@/components/visual-editor/types";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { TextField } from "./fields/TextField";
import { ColorField } from "./fields/ColorField";
import { SelectField } from "./fields/SelectField";
import { NumberField } from "./fields/NumberField";
import { SliderField } from "./fields/SliderField";
import { ToggleField } from "./fields/ToggleField";
import { BoxField } from "./fields/BoxField";
import { ShadowField } from "./fields/ShadowField";
import { CodeField } from "./fields/CodeField";

interface PropertyFieldProps {
  field: PropertyFieldSchema;
  node: ComponentNode;
}

export function PropertyField({ field, node }: PropertyFieldProps) {
  const { updateProps, updateStyles } = useEditorStore();

  // 判断该字段属于 props 还是 styles
  const isStyleField = [
    "display", "flexDirection", "justifyContent", "alignItems", "flexWrap",
    "flexGrow", "flexShrink", "flexBasis", "gap", "gridTemplateColumns",
    "gridTemplateRows", "gridColumnGap", "gridRowGap", "width", "height",
    "minWidth", "minHeight", "maxWidth", "maxHeight", "margin", "padding",
    "fontSize", "fontWeight", "fontFamily", "lineHeight", "letterSpacing",
    "textAlign", "textTransform", "textDecoration", "color", "backgroundColor",
    "borderWidth", "borderStyle", "borderColor", "borderRadius", "boxShadow",
    "opacity", "overflow", "position", "zIndex", "cursor",
  ].includes(field.key);

  const currentValue = isStyleField
    ? (node.styles as Record<string, unknown>)[field.key]
    : node.props[field.key];

  const handleChange = (val: unknown) => {
    if (isStyleField) {
      updateStyles(node.id, { [field.key]: val });
    } else {
      updateProps(node.id, { [field.key]: val });
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground block">
        {field.label}
      </label>
      <FieldRenderer
        field={field}
        value={currentValue}
        onChange={handleChange}
      />
    </div>
  );
}

// ─── 字段渲染分发器 ───
interface FieldRendererProps {
  field: PropertyFieldSchema;
  value: unknown;
  onChange: (val: unknown) => void;
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case "text":
      return (
        <TextField
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
        />
      );

    case "textarea":
      return (
        <TextField
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
          multiline
        />
      );

    case "color":
      return (
        <ColorField
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
        />
      );

    case "select":
      return (
        <SelectField
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          options={field.options ?? []}
        />
      );

    case "number":
      return (
        <NumberField
          value={(value as number) ?? 0}
          onChange={(v) => onChange(v)}
          min={field.min}
          max={field.max}
          step={field.step}
          unit={field.unit}
        />
      );

    case "slider":
      return (
        <SliderField
          value={(value as number) ?? field.defaultValue ?? 0}
          onChange={(v) => onChange(v)}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );

    case "toggle":
      return (
        <ToggleField
          value={(value as boolean) ?? false}
          onChange={(v) => onChange(v)}
        />
      );

    case "box":
      return (
        <BoxField
          value={value as never}
          onChange={(v) => onChange(v)}
        />
      );

    case "shadow":
      return (
        <ShadowField
          value={value as never}
          onChange={(v) => onChange(v)}
        />
      );

    case "code":
      return (
        <CodeField
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
        />
      );

    default:
      return (
        <TextField
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
        />
      );
  }
}
