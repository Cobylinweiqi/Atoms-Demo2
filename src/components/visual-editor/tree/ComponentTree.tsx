"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { TreeNode } from "./TreeNode";
import { CREATABLE_COMPONENTS } from "@/components/visual-editor/schema";
import { resolveSchema } from "@/components/visual-editor/utils/schema-resolver";
import { generateNodeId } from "@/components/visual-editor/utils/id-generator";
import { findNode, findParent } from "@/components/visual-editor/utils/tree-operations";
import type { ComponentNode, NodeType } from "@/components/visual-editor/types";

// ─── 收集所有节点 ID (用于 dnd-kit) ───
function collectIds(nodes: ComponentNode[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.id);
    ids.push(...collectIds(node.children));
  }
  return ids;
}

export function ComponentTree() {
  const { tree, selectNode, addNode, moveNodeAction } = useEditorStore();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addTarget, setAddTarget] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // ─── 拖拽结束 ───
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // 找到目标节点的父节点
    const overNode = findNode(tree, overId);
    if (!overNode) return;

    const overParent = findParent(tree, overId);
    const overParentId = overParent ? overParent.id : null;

    // 计算目标索引
    const siblings = overParent ? overParent.children : tree;
    const overIndex = siblings.findIndex((n) => n.id === overId);

    moveNodeAction(activeId, overParentId, overIndex);
  };

  // ─── 添加组件 ───
  const handleAddComponent = (type: NodeType, parentId: string | null) => {
    const schema = resolveSchema(type);
    const newNode: ComponentNode = {
      id: generateNodeId(),
      type,
      name: schema.label,
      children: [],
      props: { ...schema.defaultProps },
      styles: { ...schema.defaultStyles },
      visible: true,
      locked: false,
    };
    addNode(newNode, parentId);
    setShowAddMenu(false);
    setAddTarget(null);
  };

  const allIds = collectIds(tree);

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/[0.06] bg-foreground/[0.01]">
        <div className="flex items-center gap-2">
          <LucideIcons.Layers size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Layers</span>
        </div>
        <button
          onClick={() => {
            setAddTarget(null);
            setShowAddMenu((v) => !v);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-foreground/[0.04] hover:bg-foreground/[0.06] text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <LucideIcons.Plus size={12} />
          Add
        </button>
      </div>

      {/* ─── Add Menu ─── */}
      {showAddMenu && (
        <div className="border-b border-border/[0.06] bg-foreground/[0.01] max-h-[300px] overflow-y-auto">
          <div className="grid grid-cols-2 gap-1 p-2">
            {CREATABLE_COMPONENTS.map((comp) => {
              const IconComp =
                (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[comp.icon] ??
                LucideIcons.Box;
              return (
                <button
                  key={comp.type}
                  onClick={() => handleAddComponent(comp.type, addTarget)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-foreground/[0.04] text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <IconComp size={12} />
                  <span className="truncate">{comp.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Tree ─── */}
      <div
        className="flex-1 overflow-y-auto py-1"
        onClick={() => selectNode(null)}
      >
        {tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <LucideIcons.Layers size={20} className="text-muted-foreground/40 mb-2" />
            <p className="text-xs text-muted-foreground">No components yet</p>
            <p className="text-[10px] text-muted-foreground/50 mt-1">
              Click &ldquo;Add&rdquo; to create your first component
            </p>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
              {tree.map((node) => (
                <TreeNode key={node.id} node={node} depth={0} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
