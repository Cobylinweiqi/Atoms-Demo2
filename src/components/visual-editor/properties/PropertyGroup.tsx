"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import type { PropertyGroup as PropertyGroupType, PropertyFieldSchema, ComponentNode } from "@/components/visual-editor/types";
import { PropertyField } from "./PropertyField";

interface PropertyGroupProps {
  group: PropertyGroupType;
  fields: PropertyFieldSchema[];
  node: ComponentNode;
}

export function PropertyGroup({ group, fields, node }: PropertyGroupProps) {
  const [isOpen, setIsOpen] = useState(group.defaultOpen ?? false);

  // 过滤可见字段 (visibleWhen 条件)
  const visibleFields = fields.filter((field) => {
    if (!field.visibleWhen) return true;

    const conditionField = field.visibleWhen.field;
    const conditionValue = field.visibleWhen.equals;

    // 检查 styles 或 props 中的值
    const styleVal = (node.styles as Record<string, unknown>)[conditionField];
    const propVal = node.props[conditionField];
    const actualVal = styleVal ?? propVal;

    return actualVal === conditionValue;
  });

  if (visibleFields.length === 0) return null;

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[group.icon] ?? LucideIcons.Settings;

  return (
    <div className="border-b border-border/[0.04] last:border-b-0">
      {/* 分组标题 */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-foreground/[0.02] transition-colors"
      >
        <IconComponent size={13} className="text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground flex-1 text-left">
          {group.label}
        </span>
        <LucideIcons.ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 分组内容 */}
      {isOpen && (
        <div className="px-3 pb-3 space-y-2.5">
          {visibleFields.map((field) => (
            <PropertyField key={field.key} field={field} node={node} />
          ))}
        </div>
      )}
    </div>
  );
}
