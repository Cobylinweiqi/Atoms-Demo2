"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { resolveSchema } from "@/components/visual-editor/utils/schema-resolver";
import type { ComponentNode } from "@/components/visual-editor/types";

interface TreeNodeProps {
  node: ComponentNode;
  depth: number;
}

export function TreeNode({ node, depth }: TreeNodeProps) {
  const { selectedId, hoveredId, selectNode, hoverNode, toggleVisible, toggleLock, deleteNode, duplicateNodeAction } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const schema = resolveSchema(node.type);
  const hasChildren = node.children.length > 0;

  // ─── dnd-kit sortable ───
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[schema.icon] ?? LucideIcons.Box;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          isSelected
            ? "bg-primary/15 text-primary"
            : isHovered
              ? "bg-foreground/[0.04] text-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.02] hover:text-foreground"
        } ${node.visible ? "" : "opacity-40"}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          hoverNode(node.id);
          setShowActions(true);
        }}
        onMouseLeave={() => {
          hoverNode(null);
          setShowActions(false);
        }}
      >
        {/* 展开收起 */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((v) => !v);
            }}
            className="w-4 h-4 flex items-center justify-center shrink-0"
          >
            <LucideIcons.ChevronRight
              size={12}
              className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* 拖拽手柄 */}
        <button
          {...attributes}
          {...listeners}
          className="w-4 h-4 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <LucideIcons.GripVertical size={12} />
        </button>

        {/* 图标 */}
        <IconComp size={13} className="shrink-0" />

        {/* 名称 */}
        <span className="flex-1 text-xs truncate font-medium">{node.name}</span>

        {/* 操作按钮 */}
        {showActions && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateNodeAction(node.id);
              }}
              className="p-1 rounded hover:bg-foreground/[0.06] text-muted-foreground hover:text-foreground transition-colors"
              title="Duplicate"
            >
              <LucideIcons.Copy size={11} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisible(node.id);
              }}
              className="p-1 rounded hover:bg-foreground/[0.06] text-muted-foreground hover:text-foreground transition-colors"
              title={node.visible ? "Hide" : "Show"}
            >
              {node.visible ? <LucideIcons.Eye size={11} /> : <LucideIcons.EyeOff size={11} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLock(node.id);
              }}
              className="p-1 rounded hover:bg-foreground/[0.06] text-muted-foreground hover:text-foreground transition-colors"
              title={node.locked ? "Unlock" : "Lock"}
            >
              <LucideIcons.Lock size={11} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete"
            >
              <LucideIcons.Trash2 size={11} />
            </button>
          </div>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
