"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { resolveSchema } from "@/components/visual-editor/utils/schema-resolver";
import { findNode } from "@/components/visual-editor/utils/tree-operations";
import { PropertyGroup } from "./PropertyGroup";

export function PropertiesPanel() {
  const { tree, selectedId, toggleVisible, toggleLock } = useEditorStore();

  const node = selectedId ? findNode(tree, selectedId) : null;

  // ─── 空状态 ───
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-foreground/[0.03] border border-border/[0.06] flex items-center justify-center mb-3">
          <LucideIcons.MousePointerClick size={20} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No component selected</p>
        <p className="text-xs text-muted-foreground mt-1">
          Click any component on the canvas to edit its properties.
        </p>
      </div>
    );
  }

  // ─── 解析 Schema ───
  const schema = resolveSchema(node.type);
  const groupedFields = schema.groups
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      group,
      fields: schema.fields.filter((f) => f.group === group.id),
    }))
    .filter((g) => g.fields.length > 0);

  const SchemaIcon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[schema.icon] ?? LucideIcons.Box;

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
      <div className="px-3 py-3 border-b border-border/[0.06] bg-foreground/[0.01]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand-soft flex items-center justify-center">
            <SchemaIcon size={13} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {node.name}
            </p>
            <p className="text-[10px] text-muted-foreground">{schema.label}</p>
          </div>
          {/* 显隐 / 锁定 */}
          <button
            onClick={() => toggleVisible(node.id)}
            className={`p-1.5 rounded-md transition-colors ${
              node.visible
                ? "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                : "text-warning bg-warning/10"
            }`}
            title={node.visible ? "Hide" : "Show"}
          >
            {node.visible ? (
              <LucideIcons.Eye size={13} />
            ) : (
              <LucideIcons.EyeOff size={13} />
            )}
          </button>
          <button
            onClick={() => toggleLock(node.id)}
            className={`p-1.5 rounded-md transition-colors ${
              node.locked
                ? "text-warning bg-warning/10"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
            }`}
            title={node.locked ? "Unlock" : "Lock"}
          >
            <LucideIcons.Lock size={13} />
          </button>
        </div>
      </div>

      {/* ─── Property Groups ─── */}
      <div className="flex-1 overflow-y-auto">
        {groupedFields.map(({ group, fields }) => (
          <PropertyGroup key={group.id} group={group} fields={fields} node={node} />
        ))}
      </div>
    </div>
  );
}
