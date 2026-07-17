// ═══════════════════════════════════════════════════════════════
// 树操作工具 — 增删改查 / 移动 / 复制 (不可变操作)
// ═══════════════════════════════════════════════════════════════

import type { ComponentNode } from "@/components/visual-editor/types";
import { generateNodeId } from "./id-generator";

// ─── 深拷贝节点 (含重新生成 ID) ───
export function cloneNodeWithNewIds(node: ComponentNode): ComponentNode {
  return {
    ...node,
    id: generateNodeId(),
    props: { ...node.props },
    styles: { ...node.styles },
    children: node.children.map(cloneNodeWithNewIds),
  };
}

// ─── 查找节点 ───
export function findNode(
  tree: ComponentNode[],
  id: string
): ComponentNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return null;
}

// ─── 查找父节点 ───
export function findParent(
  tree: ComponentNode[],
  id: string
): ComponentNode | null {
  for (const node of tree) {
    if (node.children.some((c) => c.id === id)) return node;
    const found = findParent(node.children, id);
    if (found) return found;
  }
  return null;
}

// ─── 查找节点在树中的路径 (索引数组) ───
export function findPath(
  tree: ComponentNode[],
  id: string
): number[] | null {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) return [i];
    const subPath = findPath(tree[i].children, id);
    if (subPath) return [i, ...subPath];
  }
  return null;
}

// ─── 不可变更新: 替换节点 ───
export function replaceNode(
  tree: ComponentNode[],
  id: string,
  updater: (node: ComponentNode) => ComponentNode
): ComponentNode[] {
  return tree.map((node) => {
    if (node.id === id) return updater(node);
    if (node.children.length > 0) {
      return { ...node, children: replaceNode(node.children, id, updater) };
    }
    return node;
  });
}

// ─── 不可变更新: 删除节点 ───
export function removeNode(
  tree: ComponentNode[],
  id: string
): ComponentNode[] {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: removeNode(node.children, id),
    }));
}

// ─── 不可变更新: 添加子节点 ───
export function addChildNode(
  tree: ComponentNode[],
  parentId: string | null,
  newNode: ComponentNode,
  index?: number
): ComponentNode[] {
  // 添加到根级
  if (parentId === null) {
    const newTree = [...tree];
    if (index !== undefined) {
      newTree.splice(index, 0, newNode);
    } else {
      newTree.push(newNode);
    }
    return newTree;
  }

  return tree.map((node) => {
    if (node.id === parentId) {
      const newChildren = [...node.children];
      if (index !== undefined) {
        newChildren.splice(index, 0, newNode);
      } else {
        newChildren.push(newNode);
      }
      return { ...node, children: newChildren };
    }
    if (node.children.length > 0) {
      return { ...node, children: addChildNode(node.children, parentId, newNode, index) };
    }
    return node;
  });
}

// ─── 不可变更新: 移动节点 ───
export function moveNode(
  tree: ComponentNode[],
  nodeId: string,
  newParentId: string | null,
  newIndex: number
): ComponentNode[] {
  // 1. 找到要移动的节点
  const nodeToMove = findNode(tree, nodeId);
  if (!nodeToMove) return tree;

  // 2. 防止将节点移动到自己的子树中
  if (newParentId === nodeId) return tree;
  if (newParentId && isDescendant(nodeToMove, newParentId)) return tree;

  // 3. 从原位置移除
  let newTree = removeNode(tree, nodeId);

  // 4. 插入到新位置
  newTree = addChildNode(newTree, newParentId, nodeToMove, newIndex);

  return newTree;
}

// ─── 检查是否是后代节点 ───
export function isDescendant(node: ComponentNode, targetId: string): boolean {
  if (node.children.some((c) => c.id === targetId)) return true;
  return node.children.some((c) => isDescendant(c, targetId));
}

// ─── 不可变更新: 复制节点 ───
export function duplicateNode(
  tree: ComponentNode[],
  id: string
): ComponentNode[] {
  const node = findNode(tree, id);
  if (!node) return tree;

  const parent = findParent(tree, id);
  const cloned = cloneNodeWithNewIds(node);

  if (parent) {
    const siblingIndex = parent.children.findIndex((c) => c.id === id);
    return replaceNode(tree, parent.id, (p) => {
      const newChildren = [...p.children];
      newChildren.splice(siblingIndex + 1, 0, cloned);
      return { ...p, children: newChildren };
    });
  } else {
    // 根级节点
    const rootIndex = tree.findIndex((n) => n.id === id);
    const newTree = [...tree];
    newTree.splice(rootIndex + 1, 0, cloned);
    return newTree;
  }
}

// ─── 统计节点总数 ───
export function countNodes(tree: ComponentNode[]): number {
  return tree.reduce((acc, node) => acc + 1 + countNodes(node.children), 0);
}
