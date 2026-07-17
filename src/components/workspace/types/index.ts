// ═══════════════════════════════════════════════════════════════
// Project Workspace — 类型定义
// 对应 ER 图: docs/12-Project-Workspace-ER.sql
// ═══════════════════════════════════════════════════════════════

// ─── 通用类型 ───
export type ID = string;
export type ISODate = string;

// ─── 环境类型 ───
export type EnvType = "development" | "preview" | "staging" | "production";
export type EnvStatus = "active" | "sleeping" | "building" | "error";

// ─── 文件夹类型 ───
export type FolderNodeType = "folder" | "file";

// ─── 部署 ───
export type DeployStatus =
  | "queued"
  | "building"
  | "deploying"
  | "live"
  | "failed"
  | "cancelled";
export type DeployPlatform = "vercel" | "netlify" | "cloudflare" | "custom";

// ─── 日志 ───
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogSource = "build" | "runtime" | "deploy" | "terminal" | "system";

// ─── Git ───
export type GitSyncStatus = "pending" | "syncing" | "synced" | "failed";
export type GitSyncDirection = "push" | "pull";
export type GitProvider = "github" | "gitlab" | "bitbucket";

// ─── 数据库 ───
export type DbEngine = "postgres" | "mysql" | "sqlite" | "mongodb" | "redis";
export type DbConnStatus = "connected" | "disconnected" | "error";

// ─── 存储 ───
export type StorageProvider = "s3" | "gcs" | "azure" | "local" | "cloudflare-r2";

// ─── API ───
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// ─── Auth ───
export type AuthProviderType =
  | "email"
  | "google"
  | "github"
  | "apple"
  | "magic-link"
  | "saml";

// ─── Billing ───
export type BillingPlan = "free" | "pro" | "team" | "enterprise";
export type BillingStatus = "active" | "canceled" | "past_due" | "trialing";

// ─── History ───
export type HistoryAction =
  | "create"
  | "update"
  | "delete"
  | "deploy"
  | "rollback"
  | "config";

// ═══════════════════════════════════════════════════════════════
// 核心实体
// ═══════════════════════════════════════════════════════════════

// ─── Project ───
export interface Project {
  id: ID;
  workspaceId: ID;
  name: string;
  slug: string;
  description: string;
  type: string;
  framework: string;
  status: "draft" | "active" | "archived";
  createdBy: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Environment (Project 1:N Environment) ───
export interface Environment {
  id: ID;
  projectId: ID;
  name: string;
  type: EnvType;
  slug: string;
  status: EnvStatus;
  url?: string;
  branch?: string;
  isDefault: boolean;
  config: Record<string, unknown>;
  createdBy?: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Environment Variable (Environment 1:N EnvVar) ───
export interface EnvironmentVariable {
  id: ID;
  environmentId: ID;
  key: string;
  value?: string;            // 明文 (前端展示时脱敏)
  valueMasked?: string;      // 脱敏值
  isSecret: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Folder / File Node (自引用树) ───
export interface FolderNode {
  id: ID;
  projectId: ID;
  parentId: ID | null;
  name: string;
  path: string;
  type: FolderNodeType;
  fileType?: string;
  size: number;
  content?: string;
  sortOrder: number;
  isHidden: boolean;
  children?: FolderNode[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Deployment (Environment 1:N Deployment) ───
export interface Deployment {
  id: ID;
  projectId: ID;
  environmentId: ID;
  platform: DeployPlatform;
  status: DeployStatus;
  url?: string;
  commitHash?: string;
  commitMessage?: string;
  buildDurationMs?: number;
  envVars?: Record<string, string>;
  deployedBy?: ID;
  createdAt: ISODate;
  completedAt?: ISODate;
}

// ─── Log Entry (Deployment/Environment 1:N Log) ───
export interface LogEntry {
  id: ID;
  deploymentId?: ID;
  environmentId?: ID;
  level: LogLevel;
  source: LogSource;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: ISODate;
}

// ─── Git Connection (Project 1:1 GitConnection) ───
export interface GitConnection {
  id: ID;
  projectId: ID;
  provider: GitProvider;
  repoId?: string;
  repoFullName?: string;
  defaultBranch: string;
  webhookSecret?: string;
  connectedBy?: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Git Sync (GitConnection 1:N Sync) ───
export interface GitSync {
  id: ID;
  gitConnectionId: ID;
  direction: GitSyncDirection;
  branch: string;
  commitHash?: string;
  commitMessage?: string;
  status: GitSyncStatus;
  error?: string;
  syncedBy?: ID;
  createdAt: ISODate;
  completedAt?: ISODate;
}

// ─── Terminal Session (Environment 1:N Terminal) ───
export interface TerminalSession {
  id: ID;
  environmentId: ID;
  userId: ID;
  status: "active" | "closed";
  cwd: string;
  output: string;
  createdAt: ISODate;
  closedAt?: ISODate;
}

// ─── Database Connection (Environment 1:N DBConn) ───
export interface DatabaseConnection {
  id: ID;
  environmentId: ID;
  name: string;
  engine: DbEngine;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  passwordEncrypted?: string;
  connectionStringMasked?: string;
  status: DbConnStatus;
  poolSize: number;
  sslMode: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Storage Bucket (Environment 1:N Storage) ───
export interface StorageBucket {
  id: ID;
  environmentId: ID;
  name: string;
  provider: StorageProvider;
  bucketName: string;
  region: string;
  endpoint?: string;
  publicUrlBase?: string;
  totalSizeBytes: number;
  fileCount: number;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Storage Object (StorageBucket 1:N Object) ───
export interface StorageObject {
  id: ID;
  bucketId: ID;
  key: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  url?: string;
  isPublic: boolean;
  metadata?: Record<string, unknown>;
  uploadedBy?: ID;
  createdAt: ISODate;
}

// ─── API Endpoint (Project 1:N API) ───
export interface ApiEndpoint {
  id: ID;
  projectId: ID;
  environmentId?: ID;
  method: ApiMethod;
  path: string;
  description?: string;
  handlerCode?: string;
  authRequired: boolean;
  rateLimit?: number;
  isActive: boolean;
  createdBy?: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── Auth Config (Project 1:N AuthConfig) ───
export interface AuthConfig {
  id: ID;
  projectId: ID;
  provider: AuthProviderType;
  isEnabled: boolean;
  clientId?: string;
  redirectUrl?: string;
  scopes: string[];
  config: Record<string, unknown>;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── History Entry (Project 1:N History) ───
export interface HistoryEntry {
  id: ID;
  projectId: ID;
  environmentId?: ID;
  action: HistoryAction;
  targetType: string;
  targetId?: ID;
  targetName?: string;
  description?: string;
  changes?: { before?: unknown; after?: unknown };
  userId?: ID;
  createdAt: ISODate;
}

// ─── Project Usage (Project 1:N Usage) ───
export interface ProjectUsage {
  id: ID;
  projectId: ID;
  environmentId?: ID;
  resource: string;
  amount: number;
  unit: string;
  periodStart: ISODate;
  periodEnd: ISODate;
  createdAt: ISODate;
}

// ─── Billing Info ───
export interface BillingInfo {
  plan: BillingPlan;
  status: BillingStatus;
  currentPeriodStart: ISODate;
  currentPeriodEnd: ISODate;
  stripeCustomerId?: string;
  usage: {
    aiTokens: number;
    aiTokensLimit: number;
    buildMinutes: number;
    buildMinutesLimit: number;
    bandwidthMb: number;
    bandwidthLimitMb: number;
    storageMb: number;
    storageLimitMb: number;
    deployments: number;
    deploymentsLimit: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// UI 类型
// ═══════════════════════════════════════════════════════════════

// ─── 侧栏 Tab ───
export type WorkspaceTab =
  | "overview"
  | "files"
  | "environments"
  | "deploy"
  | "git"
  | "logs"
  | "preview"
  | "terminal"
  | "database"
  | "storage"
  | "api"
  | "auth"
  | "billing"
  | "history";

// ─── Tab 配置 ───
export interface TabConfig {
  id: WorkspaceTab;
  label: string;
  icon: string;  // Lucide icon name
  description: string;
}

export const WORKSPACE_TABS: TabConfig[] = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard", description: "项目概览与统计" },
  { id: "files", label: "Files", icon: "FolderTree", description: "文件与文件夹管理" },
  { id: "environments", label: "Environments", icon: "Server", description: "环境管理 (dev/staging/prod)" },
  { id: "deploy", label: "Deploy", icon: "Rocket", description: "部署管理与历史" },
  { id: "git", label: "Git", icon: "GitBranch", description: "Git 仓库同步" },
  { id: "logs", label: "Logs", icon: "ScrollText", description: "实时日志查看" },
  { id: "preview", label: "Preview", icon: "Eye", description: "预览环境 iframe" },
  { id: "terminal", label: "Terminal", icon: "Terminal", description: "终端模拟器" },
  { id: "database", label: "Database", icon: "Database", description: "数据库连接与查询" },
  { id: "storage", label: "Storage", icon: "HardDrive", description: "对象存储浏览" },
  { id: "api", label: "API", icon: "Webhook", description: "API 端点管理" },
  { id: "auth", label: "Auth", icon: "ShieldCheck", description: "认证配置" },
  { id: "billing", label: "Billing", icon: "CreditCard", description: "订阅与用量" },
  { id: "history", label: "History", icon: "History", description: "操作历史时间线" },
];
