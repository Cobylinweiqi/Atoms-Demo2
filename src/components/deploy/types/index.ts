// ═══════════════════════════════════════════════════════════════
// Deploy System — 类型定义
// 对应设计文档: docs/13-部署系统设计.md
// ═══════════════════════════════════════════════════════════════

// ─── 通用类型 ───
export type ID = string;
export type ISODate = string;

// ─── 部署类型 ───
export type DeployType = "deploy" | "rollback" | "promote";

// ─── 部署状态 (9 阶段状态机) ───
export type DeployStatus =
  | "queued"
  | "validating"
  | "preparing"
  | "building"
  | "packaging"
  | "deploying"
  | "configuring"
  | "activating"
  | "live"
  | "failed"
  | "cancelled";

// ─── 部署平台 ───
export type DeployPlatform = "vercel" | "cloudflare" | "docker" | "kubernetes";

// ─── 部署阶段 ───
export type DeployPhase =
  | "pre-deploy"
  | "install"
  | "build"
  | "post-build"
  | "deploy"
  | "domain"
  | "health"
  | "activate";

// ─── 日志 ───
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type LogSource = "build" | "runtime" | "deploy" | "terminal" | "system";

// ─── 环境类型 ───
export type EnvType = "development" | "preview" | "staging" | "production";
export type EnvStatus = "active" | "sleeping" | "building" | "error";

// ─── 域名 ───
export type DomainType = "subdomain" | "custom" | "wildcard";
export type DomainStatus = "pending" | "verifying" | "active" | "failed";
export type SslStatus = "pending" | "issuing" | "active" | "failed" | "renewing";
export type SslProvider = "letsencrypt" | "vercel" | "cloudflare" | "manual";

// ─── 构建产物 ───
export type ArtifactType = "static" | "docker_image" | "k8s_manifest";

// ─── 健康检查 ───
export type HealthCheckStatus = "pending" | "passed" | "failed";

// ═══════════════════════════════════════════════════════════════
// 核心实体
// ═══════════════════════════════════════════════════════════════

// ─── 部署记录 (扩展版) ───
export interface Deployment {
  id: ID;
  projectId: ID;
  environmentId: ID;
  targetId?: ID;
  type: DeployType;
  platform: DeployPlatform;
  status: DeployStatus;
  currentPhase?: DeployPhase;
  url?: string;
  commitHash?: string;
  commitMessage?: string;
  branch?: string;
  changedFiles?: number;
  buildDurationMs?: number;
  deployDurationMs?: number;
  totalDurationMs?: number;
  buildCacheHit?: boolean;
  artifactSizeBytes?: number;
  imageTag?: string;
  envVarsSnapshot?: Record<string, string>;
  healthCheckUrl?: string;
  healthCheckStatus?: HealthCheckStatus;
  artifactId?: ID;
  rollbackFromId?: ID;
  rollbackToId?: ID;
  previousDeploymentId?: ID;
  errorMessage?: string;
  deployedBy?: ID;
  createdAt: ISODate;
  completedAt?: ISODate;
}

// ─── 部署目标 (环境 + 平台配置) ───
export interface DeployTarget {
  id: ID;
  environmentId: ID;
  platform: DeployPlatform;
  platformConfig: PlatformConfig;
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── 平台特定配置 ───
export type PlatformConfig =
  | VercelConfig
  | CloudflareConfig
  | DockerConfig
  | KubernetesConfig;

export interface VercelConfig {
  projectId?: string;
  teamId?: string;
  tokenMasked?: string;
}

export interface CloudflareConfig {
  accountId?: string;
  apiTokenMasked?: string;
  projectName?: string;
}

export interface DockerConfig {
  registryUrl?: string;
  sshHost?: string;
  sshKeyMasked?: string;
  port?: number;
}

export interface KubernetesConfig {
  namespace?: string;
  ingressClass?: string;
  kubeconfigMasked?: string;
}

// ─── 自定义域名 ───
export interface CustomDomain {
  id: ID;
  environmentId: ID;
  domain: string;
  type: DomainType;
  cnameTarget: string;
  sslStatus: SslStatus;
  sslProvider: SslProvider;
  sslExpiresAt?: ISODate;
  sslIssuedAt?: ISODate;
  status: DomainStatus;
  verificationToken?: string;
  verifiedAt?: ISODate;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── 构建产物 ───
export interface DeployArtifact {
  id: ID;
  deploymentId: ID;
  type: ArtifactType;
  storageUrl: string;
  imageTag?: string;
  checksum: string;
  sizeBytes: number;
  metadata: {
    files?: number;
    entrypoint?: string;
    ports?: number[];
  };
  createdAt: ISODate;
  expiresAt: ISODate;
}

// ─── 环境变量 ───
export interface EnvironmentVariable {
  id: ID;
  environmentId: ID;
  key: string;
  value?: string;
  valueMasked?: string;
  isSecret: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── 环境 ───
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
  currentDeploymentId?: ID;
  autoDeploy: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// ─── 构建日志 ───
export interface BuildLog {
  id: ID;
  deploymentId: ID;
  phase: DeployPhase;
  level: LogLevel;
  source: LogSource;
  message: string;
  metadata?: {
    line?: number;
    file?: string;
    durationMs?: number;
  };
  timestamp: ISODate;
}

// ─── 部署配置 ───
export interface DeployConfig {
  buildCommand: string;
  outputDir: string;
  installCommand: string;
  nodeVersion: string;
  resourceLimits: {
    cpu: number;
    memoryMb: number;
  };
  buildTimeout: number; // seconds
  healthCheckPath: string;
}

// ═══════════════════════════════════════════════════════════════
// 平台元数据
// ═══════════════════════════════════════════════════════════════

export interface PlatformMeta {
  id: DeployPlatform;
  label: string;
  icon: string;
  description: string;
  features: string[];
  color: string;
}

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "vercel",
    label: "Vercel",
    icon: "Triangle",
    description: "Edge Network · 自动 SSL · Preview Deployments",
    features: ["零配置", "Edge Network", "自动 SSL", "Preview Deployments"],
    color: "#000000",
  },
  {
    id: "cloudflare",
    label: "Cloudflare Pages",
    icon: "Cloud",
    description: "全球 CDN · Workers 集成 · R2 存储",
    features: ["全球 CDN", "Workers 集成", "R2 存储", "无限带宽 (Pro)"],
    color: "#F38020",
  },
  {
    id: "docker",
    label: "Docker",
    icon: "Container",
    description: "完全控制 · 任意后端 · 自托管",
    features: ["完全控制", "任意后端", "自托管", "私有化部署"],
    color: "#2496ED",
  },
  {
    id: "kubernetes",
    label: "Kubernetes",
    icon: "Boxes",
    description: "自动伸缩 · 自愈 · 零停机滚动更新",
    features: ["自动伸缩 (HPA)", "自愈", "零停机滚动更新", "生产级"],
    color: "#326CE5",
  },
];

// ─── 部署状态元数据 ───
export interface StatusMeta {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  isLive: boolean;
  isError: boolean;
  isInProgress: boolean;
}

export const STATUS_META: Record<DeployStatus, StatusMeta> = {
  queued: { label: "Queued", color: "text-muted-foreground", bgColor: "bg-muted-foreground/10", icon: "Clock", isLive: false, isError: false, isInProgress: true },
  validating: { label: "Validating", color: "text-primary", bgColor: "bg-primary/10", icon: "ShieldCheck", isLive: false, isError: false, isInProgress: true },
  preparing: { label: "Preparing", color: "text-primary", bgColor: "bg-primary/10", icon: "Package", isLive: false, isError: false, isInProgress: true },
  building: { label: "Building", color: "text-warning", bgColor: "bg-warning/10", icon: "Hammer", isLive: false, isError: false, isInProgress: true },
  packaging: { label: "Packaging", color: "text-warning", bgColor: "bg-warning/10", icon: "Archive", isLive: false, isError: false, isInProgress: true },
  deploying: { label: "Deploying", color: "text-primary", bgColor: "bg-primary/10", icon: "Upload", isLive: false, isError: false, isInProgress: true },
  configuring: { label: "Configuring", color: "text-primary", bgColor: "bg-primary/10", icon: "Settings", isLive: false, isError: false, isInProgress: true },
  activating: { label: "Activating", color: "text-primary", bgColor: "bg-primary/10", icon: "Zap", isLive: false, isError: false, isInProgress: true },
  live: { label: "Live", color: "text-success", bgColor: "bg-success/10", icon: "CheckCircle2", isLive: true, isError: false, isInProgress: false },
  failed: { label: "Failed", color: "text-destructive", bgColor: "bg-destructive/10", icon: "XCircle", isLive: false, isError: true, isInProgress: false },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted-foreground/10", icon: "Ban", isLive: false, isError: false, isInProgress: false },
};

// ─── 部署阶段定义 ───
export interface PhaseMeta {
  id: DeployPhase;
  label: string;
  icon: string;
}

export const PHASES: PhaseMeta[] = [
  { id: "pre-deploy", label: "Pre-deploy", icon: "ShieldCheck" },
  { id: "install", label: "Install Dependencies", icon: "Download" },
  { id: "build", label: "Build", icon: "Hammer" },
  { id: "post-build", label: "Post-build", icon: "Package" },
  { id: "deploy", label: "Deploy", icon: "Upload" },
  { id: "domain", label: "Domain & SSL", icon: "Globe" },
  { id: "health", label: "Health Check", icon: "HeartPulse" },
  { id: "activate", label: "Activate", icon: "Zap" },
];

// ─── UI 视图类型 ───
export type DeployView = "overview" | "history" | "domains" | "settings";
