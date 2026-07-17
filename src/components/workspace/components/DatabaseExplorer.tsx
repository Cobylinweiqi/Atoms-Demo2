"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "../stores/workspace-store";
import type { DatabaseConnection } from "../types";

// ═══════════════════════════════════════════════════════════════
// DatabaseExplorer — 数据库浏览器
// 展示: 数据库连接 / 表列表 / SQL 查询 / 查询结果
// ═══════════════════════════════════════════════════════════════

const MOCK_TABLES = [
  { name: "users", rows: 1245, size: "4.2 MB" },
  { name: "projects", rows: 89, size: "1.1 MB" },
  { name: "environments", rows: 267, size: "0.8 MB" },
  { name: "deployments", rows: 1540, size: "12.3 MB" },
  { name: "conversations", rows: 3421, size: "45.6 MB" },
  { name: "messages", rows: 28765, size: "128.4 MB" },
];

const MOCK_COLUMNS = [
  { name: "id", type: "uuid", nullable: false, isPK: true },
  { name: "email", type: "varchar(255)", nullable: false, isPK: false },
  { name: "name", type: "varchar(100)", nullable: false, isPK: false },
  { name: "created_at", type: "timestamptz", nullable: false, isPK: false },
];

const MOCK_QUERY_RESULTS = [
  { id: "a1b2c3d4", email: "alice@example.com", name: "Alice", created_at: "2026-07-01 10:23:00" },
  { id: "e5f6g7h8", email: "bob@example.com", name: "Bob", created_at: "2026-07-02 14:45:00" },
  { id: "i9j0k1l2", email: "charlie@example.com", name: "Charlie", created_at: "2026-07-03 09:12:00" },
];

export function DatabaseExplorer() {
  const databaseConnections = useWorkspaceStore((s) => s.databaseConnections);
  const activeEnvId = useWorkspaceStore((s) => s.activeEnvironmentId);
  const connectDatabase = useWorkspaceStore((s) => s.connectDatabase);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;");
  const [showResults, setShowResults] = useState(false);

  const envDbs = databaseConnections.filter((db) => db.environmentId === activeEnvId);

  return (
    <div className="flex h-full">
      {/* ─── 数据库列表 ─── */}
      <div className="flex w-64 shrink-0 flex-col border-r border-border/[0.06]">
        <div className="border-b border-border/[0.06] px-4 py-2.5">
          <span className="text-sm font-semibold text-foreground">Databases</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {envDbs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground/30">
              <LucideIcons.Database size={24} />
              <span className="text-[10px]">No databases connected</span>
            </div>
          ) : (
            envDbs.map((db) => (
              <DbItem
                key={db.id}
                db={db}
                isSelected={selectedDb === db.id}
                onClick={() => { setSelectedDb(db.id); setSelectedTable(null); }}
                onToggle={() => connectDatabase(db.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── 表列表 + 查询 ─── */}
      <div className="flex flex-1 flex-col">
        {selectedDb ? (
          <>
            {/* 表列表 */}
            <div className="border-b border-border/[0.06]">
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">Tables</span>
              </div>
              <div className="flex gap-1 overflow-x-auto px-4 pb-2">
                {MOCK_TABLES.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => setSelectedTable(table.name)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors",
                      selectedTable === table.name ? "bg-foreground/8 text-foreground" : "text-muted-foreground/50 hover:bg-foreground/4 hover:text-foreground",
                    )}
                  >
                    <LucideIcons.Table size={11} />
                    {table.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 表结构 / 查询 */}
            {selectedTable ? (
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* 列信息 */}
                <div className="border-b border-border/[0.06] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <LucideIcons.Table size={14} className="text-primary/60" />
                    <span className="text-sm font-medium text-foreground">{selectedTable}</span>
                    <span className="text-[10px] text-muted-foreground/40">{MOCK_TABLES.find((t) => t.name === selectedTable)?.rows.toLocaleString()} rows · {MOCK_TABLES.find((t) => t.name === selectedTable)?.size}</span>
                  </div>
                  <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-2 text-[11px]">
                    <div className="font-mono font-medium text-muted-foreground/40">Column</div>
                    <div className="font-mono font-medium text-muted-foreground/40">Type</div>
                    <div className="font-mono font-medium text-muted-foreground/40">Nullable</div>
                    <div className="font-mono font-medium text-muted-foreground/40">Key</div>
                    {MOCK_COLUMNS.map((col) => (
                      <React.Fragment key={col.name}>
                        <div className="flex items-center gap-1 font-mono text-foreground">
                          {col.isPK && <LucideIcons.KeyRound size={10} className="text-warning" />}
                          {col.name}
                        </div>
                        <div className="font-mono text-muted-foreground/60">{col.type}</div>
                        <div className="font-mono text-muted-foreground/60">{col.nullable ? "YES" : "NO"}</div>
                        <div className="font-mono text-muted-foreground/60">{col.isPK ? "PK" : ""}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* SQL 查询 */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-border/[0.06] px-4 py-1.5">
                    <LucideIcons.TerminalSquare size={12} className="text-primary/60" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">SQL Query</span>
                    <button
                      onClick={() => setShowResults(true)}
                      className="ml-auto flex items-center gap-1 rounded-md bg-gradient-brand px-2.5 py-0.5 text-[10px] font-medium text-white"
                    >
                      <LucideIcons.Play size={9} />
                      Run
                    </button>
                  </div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 resize-none bg-foreground/[0.02] p-3 font-mono text-xs text-foreground focus:outline-none"
                    spellCheck={false}
                  />

                  {/* 查询结果 */}
                  {showResults && (
                    <div className="h-48 overflow-auto border-t border-border/[0.06]">
                      <div className="sticky top-0 grid grid-cols-4 bg-foreground/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        <span>id</span>
                        <span>email</span>
                        <span>name</span>
                        <span>created_at</span>
                      </div>
                      {MOCK_QUERY_RESULTS.map((row) => (
                        <div key={row.id} className="grid grid-cols-4 border-b border-border/[0.04] px-3 py-1.5 text-[11px] font-mono hover:bg-foreground/[0.02]">
                          <span className="truncate text-muted-foreground/50">{row.id}</span>
                          <span className="truncate text-foreground">{row.email}</span>
                          <span className="truncate text-foreground">{row.name}</span>
                          <span className="truncate text-muted-foreground/50">{row.created_at}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground/30">
                <LucideIcons.Table size={28} />
                <span className="text-xs">Select a table to view schema</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground/30">
            <LucideIcons.Database size={28} />
            <span className="text-xs">Select a database to explore</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DbItem({ db, isSelected, onClick, onToggle }: {
  db: DatabaseConnection; isSelected: boolean; onClick: () => void; onToggle: () => void;
}) {
  const engineIcon = { postgres: LucideIcons.Database, mysql: LucideIcons.Database, sqlite: LucideIcons.Box, mongodb: LucideIcons.Leaf, redis: LucideIcons.Zap }[db.engine] ?? LucideIcons.Database;
  const Icon = engineIcon;
  const statusColor = { connected: "bg-success", disconnected: "bg-muted-foreground/30", error: "bg-destructive" }[db.status] ?? "bg-muted-foreground/30";

  return (
    <div
      onClick={onClick}
      className={cn("group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-foreground/[0.03]", isSelected && "bg-foreground/[0.06]")}
    >
      <Icon size={14} className="text-muted-foreground/50" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-foreground">{db.name}</div>
        <div className="truncate text-[9px] text-muted-foreground/40">{db.engine} · {db.host}:{db.port}</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={cn("h-2 w-2 shrink-0 rounded-full transition-colors", statusColor)}
        title={db.status}
      />
    </div>
  );
}
