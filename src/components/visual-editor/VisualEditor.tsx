"use client";

import React, { useEffect } from "react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { EditorToolbar } from "@/components/visual-editor/toolbar/EditorToolbar";
import { ComponentTree } from "@/components/visual-editor/tree/ComponentTree";
import { Canvas } from "@/components/visual-editor/canvas/Canvas";
import { PropertiesPanel } from "@/components/visual-editor/properties/PropertiesPanel";
import { resolveSchema } from "@/components/visual-editor/utils/schema-resolver";
import { generateNodeId } from "@/components/visual-editor/utils/id-generator";
import type { ComponentNode, NodeType } from "@/components/visual-editor/types";

// ─── 创建初始节点 ───
function createNode(type: NodeType): ComponentNode {
  const schema = resolveSchema(type);
  return {
    id: generateNodeId(),
    type,
    name: schema.label,
    children: [],
    props: { ...schema.defaultProps },
    styles: { ...schema.defaultStyles },
    visible: true,
    locked: false,
  };
}

// ─── 创建默认组件树 ───
function createInitialTree(): ComponentNode[] {
  const section = createNode("Section");
  section.name = "Hero Section";

  const heading = createNode("Text");
  heading.name = "Hero Title";
  heading.props = { text: "Build anything.", tag: "h1" };
  heading.styles = {
    ...heading.styles,
    fontSize: "48px",
    fontWeight: "600",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  };

  const subtitle = createNode("Text");
  subtitle.name = "Hero Subtitle";
  subtitle.props = { text: "Just describe it. AI builds the rest.", tag: "p" };
  subtitle.styles = {
    ...subtitle.styles,
    fontSize: "18px",
    color: "hsl(var(--muted-foreground))",
    lineHeight: "1.65",
  };

  const buttonContainer = createNode("Container");
  buttonContainer.name = "Button Group";
  buttonContainer.styles = {
    ...buttonContainer.styles,
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    padding: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    backgroundColor: "transparent",
  };

  const ctaButton = createNode("Button");
  ctaButton.name = "CTA Button";
  ctaButton.props = { text: "Start Building", variant: "primary", size: "lg", disabled: false };

  const demoButton = createNode("Button");
  demoButton.name = "Demo Button";
  demoButton.props = { text: "Watch Demo", variant: "secondary", size: "lg", disabled: false };

  buttonContainer.children = [ctaButton, demoButton];
  section.children = [heading, subtitle, buttonContainer];

  return [section];
}

export function VisualEditor() {
  const { setTree, tree } = useEditorStore();

  // ─── 初始化默认组件树 ───
  useEffect(() => {
    if (tree.length === 0) {
      setTree(createInitialTree());
    }
  }, [tree.length, setTree]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* ─── 顶部工具栏 ─── */}
      <EditorToolbar />

      {/* ─── 三栏布局 ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧: 组件树 */}
        <aside className="w-[260px] shrink-0 border-r border-border/[0.06] bg-surface-1">
          <ComponentTree />
        </aside>

        {/* 中间: 画布 */}
        <main className="flex-1 min-w-0">
          <Canvas />
        </main>

        {/* 右侧: 属性面板 */}
        <aside className="w-[300px] shrink-0 border-l border-border/[0.06] bg-surface-1">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
}
