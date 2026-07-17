// ═══════════════════════════════════════════════════════════════
// Memory Store — Memory 持久化
// 职责: 存储 / 检索 / 更新 / 删除 长期记忆
// 支持: localStorage 持久化 / 按类型筛选 / 全文搜索 / Pin
// ═══════════════════════════════════════════════════════════════

import type { MemoryEntry, MemoryType } from "../types";

const STORAGE_KEY = "nova-builder-memory";
const MAX_ENTRIES = 200;

// ─── 生成 ID ───
function genId(): string {
  return `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ═══════════════════════════════════════════════════════════════
// MemoryStore
// ═══════════════════════════════════════════════════════════════

export class MemoryStore {
  private entries: Map<string, MemoryEntry> = new Map();
  private storageKey: string;

  constructor(options?: { storageKey?: string; autoLoad?: boolean }) {
    this.storageKey = options?.storageKey ?? STORAGE_KEY;
    if (options?.autoLoad !== false) {
      this.load();
    }
  }

  // ─── 添加 Memory ───
  add(
    type: MemoryType,
    key: string,
    value: string,
    options?: { pinned?: boolean; source?: string },
  ): MemoryEntry {
    const now = Date.now();
    const entry: MemoryEntry = {
      id: genId(),
      type,
      key,
      value,
      createdAt: now,
      updatedAt: now,
      pinned: options?.pinned ?? false,
      source: options?.source,
    };

    // 去重: 同 type + key 已存在则更新
    for (const [id, existing] of Array.from(this.entries.entries())) {
      if (existing.type === type && existing.key === key) {
        const updated: MemoryEntry = {
          ...existing,
          value,
          updatedAt: now,
          pinned: options?.pinned ?? existing.pinned,
          source: options?.source ?? existing.source,
        };
        this.entries.set(id, updated);
        this.save();
        return updated;
      }
    }

    // 限额: 超过上限时移除最旧的非 pinned 项
    if (this.entries.size >= MAX_ENTRIES) {
      this.evictOldest();
    }

    this.entries.set(entry.id, entry);
    this.save();
    return entry;
  }

  // ─── 更新 ───
  update(id: string, patch: Partial<MemoryEntry>): MemoryEntry | undefined {
    const existing = this.entries.get(id);
    if (!existing) return undefined;
    const updated: MemoryEntry = {
      ...existing,
      ...patch,
      id: existing.id, // 不可变
      updatedAt: Date.now(),
    };
    this.entries.set(id, updated);
    this.save();
    return updated;
  }

  // ─── 删除 ───
  remove(id: string): void {
    this.entries.delete(id);
    this.save();
  }

  // ─── Pin / Unpin ───
  togglePin(id: string): MemoryEntry | undefined {
    const existing = this.entries.get(id);
    if (!existing) return undefined;
    return this.update(id, { pinned: !existing.pinned });
  }

  // ─── 获取全部 (pinned 优先, 按更新时间排序) ───
  getAll(): MemoryEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }

  // ─── 按类型筛选 ───
  getByType(type: MemoryType): MemoryEntry[] {
    return this.getAll().filter((e) => e.type === type);
  }

  // ─── 全文搜索 ───
  search(query: string): MemoryEntry[] {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (e) =>
        e.key.toLowerCase().includes(q) ||
        e.value.toLowerCase().includes(q),
    );
  }

  // ─── 获取 pinned ───
  getPinned(): MemoryEntry[] {
    return this.getAll().filter((e) => e.pinned);
  }

  // ─── 导出 JSON ───
  export(): string {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: Date.now(),
        entries: this.getAll(),
      },
      null,
      2,
    );
  }

  // ─── 导入 JSON ───
  import(json: string, merge = true): number {
    try {
      const data = JSON.parse(json);
      const entries: MemoryEntry[] = data.entries ?? data;
      let count = 0;
      for (const entry of entries) {
        if (!merge) this.entries.clear();
        this.entries.set(entry.id, entry);
        count++;
      }
      this.save();
      return count;
    } catch {
      return 0;
    }
  }

  // ─── 清空 ───
  clear(): void {
    this.entries.clear();
    this.save();
  }

  // ─── 统计 ───
  getStats(): { count: number; pinned: number; byType: Record<string, number> } {
    const all = this.getAll();
    const byType: Record<string, number> = {};
    for (const e of all) {
      byType[e.type] = (byType[e.type] ?? 0) + 1;
    }
    return {
      count: all.length,
      pinned: all.filter((e) => e.pinned).length,
      byType,
    };
  }

  // ─── 持久化: 保存到 localStorage ───
  private save(): void {
    if (typeof window === "undefined") return;
    try {
      const data = Array.from(this.entries.values());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch {
      // localStorage 可能满或被禁用
    }
  }

  // ─── 持久化: 从 localStorage 加载 ───
  private load(): void {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const entries: MemoryEntry[] = JSON.parse(raw);
      for (const entry of entries) {
        this.entries.set(entry.id, entry);
      }
    } catch {
      // 解析失败, 忽略
    }
  }

  // ─── 淘汰最旧非 pinned 项 ───
  private evictOldest(): void {
    let oldestId: string | null = null;
    let oldestTime = Infinity;
    for (const [id, entry] of Array.from(this.entries.entries())) {
      if (entry.pinned) continue;
      if (entry.updatedAt < oldestTime) {
        oldestTime = entry.updatedAt;
        oldestId = id;
      }
    }
    if (oldestId) this.entries.delete(oldestId);
  }
}

// ─── 单例 (浏览器端) ───
let _instance: MemoryStore | null = null;
export function getMemoryStore(): MemoryStore {
  if (!_instance) {
    _instance = new MemoryStore();
  }
  return _instance;
}
