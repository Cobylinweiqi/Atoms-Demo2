"use client";

import React, { useState } from "react";
import { useEditorStore } from "@/components/visual-editor/stores/editor-store";
import { stylesToCss } from "@/components/visual-editor/utils/style-generator";
import { resolveSchema } from "@/components/visual-editor/utils/schema-resolver";
import { CanvasRenderer } from "./CanvasRenderer";
import type { ComponentNode } from "@/components/visual-editor/types";

interface SelectableNodeProps {
  node: ComponentNode;
  isRoot?: boolean;
}

export function SelectableNode({ node, isRoot = false }: SelectableNodeProps) {
  const { selectedId, hoveredId, selectNode, hoverNode } = useEditorStore();
  const [isDragOver, setIsDragOver] = useState(false);

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const schema = resolveSchema(node.type);
  const css = stylesToCss(node.styles);

  // 合并选中/悬停状态的边框
  const overlayStyle: React.CSSProperties = {
    ...css,
    outline: isSelected
      ? "2px solid hsl(var(--primary))"
      : isHovered
        ? "1px solid hsl(var(--foreground) / 0.25)"
        : css.outline,
    outlineOffset: isSelected ? "2px" : "0px",
    cursor: node.locked ? "not-allowed" : "pointer",
    position: css.position || "relative",
    opacity: node.visible ? css.opacity : 0.3,
  };

  // 渲染组件内容
  const renderContent = () => {
    switch (node.type) {
      case "Text": {
        const tag = (node.props.tag as string) || "p";
        const text = (node.props.text as string) || "Text";
        const Tag = tag as keyof JSX.IntrinsicElements;
        return React.createElement(Tag, null, text);
      }

      case "Button": {
        const variant = (node.props.variant as string) || "primary";
        const size = (node.props.size as string) || "md";
        const text = (node.props.text as string) || "Button";
        const variantStyles: Record<string, React.CSSProperties> = {
          primary: { background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" },
          secondary: { background: "hsl(var(--foreground) / 0.05)", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--foreground) / 0.08)" },
          ghost: { background: "transparent", color: "hsl(var(--muted-foreground))" },
          outline: { background: "transparent", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--foreground) / 0.12)" },
        };
        const sizeStyles: Record<string, React.CSSProperties> = {
          sm: { height: "36px", padding: "0 16px" },
          md: { height: "44px", padding: "0 24px" },
          lg: { height: "48px", padding: "0 32px" },
        };
        return (
          <span
            style={{
              ...variantStyles[variant],
              ...sizeStyles[size],
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 500,
              width: "100%",
              height: "100%",
              opacity: node.props.disabled ? 0.4 : 1,
            }}
          >
            {text}
          </span>
        );
      }

      case "Image": {
        return (
          <img
            src={(node.props.src as string) || "https://via.placeholder.com/400x300/11111A/71717A?text=Image"}
            alt={(node.props.alt as string) || ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: ((node.props.fit as string) || "cover") as React.CSSProperties["objectFit"],
              borderRadius: css.borderRadius,
            }}
          />
        );
      }

      case "Input": {
        return (
          <input
            type={(node.props.type as string) || "text"}
            placeholder={(node.props.placeholder as string) || ""}
            disabled={node.props.disabled as boolean}
            style={{
              width: "100%",
              height: "100%",
              background: "hsl(var(--foreground) / 0.03)",
              border: "1px solid hsl(var(--foreground) / 0.08)",
              borderRadius: "var(--radius-md)",
              padding: "0 16px",
              color: "hsl(var(--foreground))",
              fontSize: "15px",
              outline: "none",
            }}
            readOnly
          />
        );
      }

      case "Divider": {
        return null;
      }

      case "Link": {
        return (
          <a
            href={(node.props.href as string) || "#"}
            target={(node.props.target as string) || "_self"}
            style={{ display: "inline-block", width: "100%" }}
            onClick={(e) => e.preventDefault()}
          >
            {(node.props.text as string) || "Link"}
          </a>
        );
      }

      case "Badge": {
        const variant = (node.props.variant as string) || "default";
        const variantStyles: Record<string, React.CSSProperties> = {
          default: { background: "hsl(var(--foreground) / 0.05)", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--foreground) / 0.06)" },
          brand: { background: "var(--gradient-brand)", color: "hsl(var(--primary-foreground))" },
          success: { background: "hsl(var(--success) / 0.15)", color: "hsl(var(--success))", border: "1px solid hsl(var(--success) / 0.3)" },
          warning: { background: "hsl(var(--warning) / 0.15)", color: "hsl(var(--warning))", border: "1px solid hsl(var(--warning) / 0.3)" },
          error: { background: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))", border: "1px solid hsl(var(--destructive) / 0.3)" },
        };
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 500,
              ...variantStyles[variant],
            }}
          >
            {(node.props.text as string) || "Badge"}
          </span>
        );
      }

      case "Icon": {
        return (
          <span style={{ display: "inline-flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" style={{ maxWidth: "48px", maxHeight: "48px" }}>
              <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.1L12 17.3 6.5 19.4l1-6.1L3 8.9 9 8l3-6z" />
            </svg>
          </span>
        );
      }

      case "Container":
      case "Section":
      case "Card": {
        // 有子节点的容器 — 递归渲染
        if (node.children.length === 0) {
          return (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                minHeight: "48px",
                color: "hsl(var(--muted-foreground))",
                fontSize: "13px",
                fontStyle: "italic",
              }}
            >
              Drop components here
            </span>
          );
        }
        return node.children.map((child) => (
          <SelectableNode key={child.id} node={child} />
        ));
      }

      default:
        return null;
    }
  };

  // ─── 容器类型需要包装子节点 ───
  const isContainer = schema.canHaveChildren;

  // ─── 拖放处理 ───
  const handleDragOver = (e: React.DragEvent) => {
    if (!isContainer || node.locked) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isContainer || node.locked) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    // 拖放逻辑将在 ComponentTree 中处理
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.locked) {
      selectNode(node.id);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.locked) {
      hoverNode(node.id);
    }
  };

  const handleMouseLeave = () => {
    hoverNode(null);
  };

  // ─── 渲染 ───
  return (
    <div
      style={overlayStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-node-id={node.id}
      data-node-type={node.type}
      className={`transition-all duration-150 ${isDragOver ? "ring-1 ring-primary/50" : ""}`}
    >
      {/* 选中标签 */}
      {isSelected && !isRoot && (
        <span
          style={{
            position: "absolute",
            top: "-22px",
            left: "-2px",
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            fontSize: "10px",
            fontWeight: 500,
            padding: "1px 6px",
            borderRadius: "4px",
            zIndex: 100,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {node.name}
        </span>
      )}
      {renderContent()}
    </div>
  );
}
