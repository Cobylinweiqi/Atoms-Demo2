// ═══════════════════════════════════════════════════════════════
// Editor Store — 可视化编辑器核心状态管理 (Zustand)
// ═══════════════════════════════════════════════════════════════

"use client";

import { create } from "zustand";
import type {
  ComponentNode,
  ComponentStyles,
  Viewport,
  HistoryEntry,
  HistoryActionType,
} from "@/components/visual-editor/types";
import {
  findNode,
  replaceNode,
  removeNode,
  addChildNode,
  moveNode,
  duplicateNode,
} from "@/components/visual-editor/utils/tree-operations";
import { generateNodeId, generateHistoryId } from "@/components/visual-editor/utils/id-generator";

// ─── 历史记录标签 ───
const HISTORY_LABELS: Record<HistoryActionType, string> = {
  add: "Added component",
  delete: "Deleted component",
  move: "Moved component",
  duplicate: "Duplicated component",
  "update-props": "Updated properties",
  "update-styles": "Updated styles",
  "toggle-visible": "Toggled visibility",
  "toggle-lock": "Toggled lock",
};

interface EditorState {
  // ═══ State ═══
  tree: ComponentNode[];
  selectedId: string | null;
  hoveredId: string | null;
  viewport: Viewport;
  showHistory: boolean;

  // ═══ History ═══
  past: HistoryEntry[];
  future: HistoryEntry[];
  maxHistory: number;

  // ═══ Actions — Tree ═══
  addNode: (node: ComponentNode, parentId: string | null, index?: number) => void;
  deleteNode: (id: string) => void;
  moveNodeAction: (id: string, newParentId: string | null, newIndex: number) => void;
  duplicateNodeAction: (id: string) => void;

  // ═══ Actions — Selection ═══
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;

  // ═══ Actions — Properties ═══
  updateProps: (id: string, partialProps: Record<string, unknown>) => void;
  updateStyles: (id: string, partialStyles: Partial<ComponentStyles>) => void;
  toggleVisible: (id: string) => void;
  toggleLock: (id: string) => void;

  // ═══ Actions — History ═══
  undo: () => void;
  redo: () => void;
  jumpTo: (historyId: string) => void;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // ═══ Actions — Viewport ═══
  setViewport: (vp: Viewport) => void;
  toggleHistory: () => void;

  // ═══ Actions — Init ═══
  setTree: (tree: ComponentNode[]) => void;
}

// ─── 深拷贝快照 ───
function snapshot(tree: ComponentNode[]): ComponentNode[] {
  return structuredClone(tree);
}

// ─── 创建历史记录 ───
function createHistoryEntry(
  action: HistoryActionType,
  tree: ComponentNode[],
  nodeId?: string
): HistoryEntry {
  return {
    id: generateHistoryId(),
    timestamp: Date.now(),
    action,
    label: HISTORY_LABELS[action],
    nodeId,
    snapshot: snapshot(tree),
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // ═══ Initial State ═══
  tree: [],
  selectedId: null,
  hoveredId: null,
  viewport: "desktop",
  showHistory: false,

  past: [],
  future: [],
  maxHistory: 50,

  // ═══ Tree Actions ═══
  addNode: (node, parentId, index) => {
    const state = get();
    const newTree = addChildNode(state.tree, parentId, node, index);
    const entry = createHistoryEntry("add", newTree, node.id);

    set((s) => ({
      tree: newTree,
      selectedId: node.id,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  deleteNode: (id) => {
    const state = get();
    const newTree = removeNode(state.tree, id);
    const entry = createHistoryEntry("delete", newTree, id);

    set((s) => ({
      tree: newTree,
      selectedId: s.selectedId === id ? null : s.selectedId,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  moveNodeAction: (id, newParentId, newIndex) => {
    const state = get();
    const newTree = moveNode(state.tree, id, newParentId, newIndex);
    if (newTree === state.tree) return; // 无效移动

    const entry = createHistoryEntry("move", newTree, id);

    set((s) => ({
      tree: newTree,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  duplicateNodeAction: (id) => {
    const state = get();
    const newTree = duplicateNode(state.tree, id);
    const entry = createHistoryEntry("duplicate", newTree, id);

    set((s) => ({
      tree: newTree,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  // ═══ Selection ═══
  selectNode: (id) => set({ selectedId: id }),
  hoverNode: (id) => set({ hoveredId: id }),

  // ═══ Properties ═══
  updateProps: (id, partialProps) => {
    const state = get();
    const node = findNode(state.tree, id);
    if (!node) return;

    const newTree = replaceNode(state.tree, id, (n) => ({
      ...n,
      props: { ...n.props, ...partialProps },
    }));

    const entry = createHistoryEntry("update-props", newTree, id);

    set((s) => ({
      tree: newTree,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  updateStyles: (id, partialStyles) => {
    const state = get();
    const node = findNode(state.tree, id);
    if (!node) return;

    const newTree = replaceNode(state.tree, id, (n) => ({
      ...n,
      styles: { ...n.styles, ...partialStyles },
    }));

    const entry = createHistoryEntry("update-styles", newTree, id);

    set((s) => ({
      tree: newTree,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  toggleVisible: (id) => {
    const state = get();
    const newTree = replaceNode(state.tree, id, (n) => ({
      ...n,
      visible: !n.visible,
    }));
    const entry = createHistoryEntry("toggle-visible", newTree, id);

    set((s) => ({
      tree: newTree,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  toggleLock: (id) => {
    const state = get();
    const newTree = replaceNode(state.tree, id, (n) => ({
      ...n,
      locked: !n.locked,
    }));
    const entry = createHistoryEntry("toggle-lock", newTree, id);

    set((s) => ({
      tree: newTree,
      past: [...s.past, entry].slice(-s.maxHistory),
      future: [],
    }));
  },

  // ═══ History ═══
  undo: () => {
    const state = get();
    if (state.past.length === 0) return;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);

    const currentEntry = createHistoryEntry(
      "update-styles", // 通用标签
      state.tree
    );

    set({
      tree: previous.snapshot,
      past: newPast,
      future: [currentEntry, ...state.future],
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    const currentEntry = createHistoryEntry(
      "update-styles",
      state.tree
    );

    set({
      tree: next.snapshot,
      past: [...state.past, currentEntry],
      future: newFuture,
    });
  },

  jumpTo: (historyId) => {
    const state = get();

    // 在 past 中查找
    const pastIndex = state.past.findIndex((e) => e.id === historyId);
    if (pastIndex !== -1) {
      const target = state.past[pastIndex];
      const entriesBetween = state.past.slice(pastIndex + 1);
      const currentEntry = createHistoryEntry("update-styles", state.tree);

      set({
        tree: target.snapshot,
        past: state.past.slice(0, pastIndex),
        future: [...entriesBetween.reverse(), currentEntry, ...state.future],
      });
      return;
    }

    // 在 future 中查找
    const futureIndex = state.future.findIndex((e) => e.id === historyId);
    if (futureIndex !== -1) {
      const target = state.future[futureIndex];
      const entriesBetween = state.future.slice(0, futureIndex);
      const currentEntry = createHistoryEntry("update-styles", state.tree);

      set({
        tree: target.snapshot,
        past: [...state.past, currentEntry, ...entriesBetween],
        future: state.future.slice(futureIndex + 1),
      });
    }
  },

  clearHistory: () => set({ past: [], future: [] }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  // ═══ Viewport ═══
  setViewport: (vp) => set({ viewport: vp }),
  toggleHistory: () => set((s) => ({ showHistory: !s.showHistory })),

  // ═══ Init ═══
  setTree: (tree) => set({ tree, selectedId: null, past: [], future: [] }),
}));
