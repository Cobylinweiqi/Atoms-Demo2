"use client";

import React from "react";
import type { ComponentNode } from "@/components/visual-editor/types";
import { SelectableNode } from "./SelectableNode";

interface CanvasRendererProps {
  nodes: ComponentNode[];
}

/**
 * 递归渲染组件树到画布
 */
export function CanvasRenderer({ nodes }: CanvasRendererProps) {
  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-sm text-muted-foreground">Canvas is empty</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Add components from the left panel
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {nodes.map((node) => (
        <SelectableNode key={node.id} node={node} />
      ))}
    </div>
  );
}
