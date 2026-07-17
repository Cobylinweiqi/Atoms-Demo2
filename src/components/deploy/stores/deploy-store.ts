// ═══════════════════════════════════════════════════════════════
// Deploy Store — 部署系统状态管理 (Zustand)
// 包含: 部署记录 / 部署目标 / 域名 / 构建日志 / 环境变量
// ═══════════════════════════════════════════════════════════════

"use client";

import { create } from "zustand";
import type {
  BuildLog,
  CustomDomain,
  DeployConfig,
  DeployPhase,
  DeployPlatform,
  DeployStatus,
  DeployTarget,
  DeployType,
  DeployView,
  Deployment,
  Environment,
  EnvironmentVariable,
} from "../types";

// ═══════════════════════════════════════════════════════════════
// Store 接口
// ═══════════════════════════════════════════════════════════════

interface DeployStore {
  // ═══ State ═══
  activeView: DeployView;
  environments: Environment[];
  activeEnvironmentId: string | null;
  deployments: Deployment[];
  deployTargets: DeployTarget[];
  customDomains: CustomDomain[];
  buildLogs: Record<string, BuildLog[]>;
  environmentVariables: EnvironmentVariable[];
  deployConfig: DeployConfig;
  selectedPlatform: DeployPlatform;
  selectedDeploymentId: string | null;
  isDeploying: boolean;

  // ═══ Actions ═══
  setActiveView: (view: DeployView) => void;
  setActiveEnvironment: (id: string) => void;
  setSelectedPlatform: (platform: DeployPlatform) => void;
  setSelectedDeployment: (id: string | null) => void;

  createDeployment: (platform: DeployPlatform, type?: DeployType) => void;
  cancelDeployment: (id: string) => void;
  rollbackDeployment: (targetDeploymentId: string) => void;
  promoteDeployment: (sourceDeploymentId: string) => void;
  redeploy: (deploymentId: string) => void;

  addDomain: (domain: string) => void;
  removeDomain: (id: string) => void;
  verifyDomain: (id: string) => void;

  addEnvironmentVariable: (key: string, value: string, isSecret: boolean) => void;
  removeEnvironmentVariable: (id: string) => void;
  updateDeployConfig: (config: Partial<DeployConfig>) => void;

  loadMockData: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════════

const now = () => new Date().toISOString();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

const MOCK_ENVIRONMENTS: Environment[] = [
  {
    id: "env_dev",
    projectId: "proj_001",
    name: "Development",
    type: "development",
    slug: "dev",
    status: "active",
    url: "https://nova-landing-dev.nova-studio.app",
    branch: "develop",
    isDefault: true,
    currentDeploymentId: "dep_005",
    autoDeploy: true,
    createdAt: minutesAgo(14400),
    updatedAt: minutesAgo(30),
  },
  {
    id: "env_preview",
    projectId: "proj_001",
    name: "Preview",
    type: "preview",
    slug: "preview",
    status: "active",
    url: "https://nova-landing-preview.nova-studio.app",
    branch: "main",
    isDefault: false,
    currentDeploymentId: "dep_003",
    autoDeploy: true,
    createdAt: minutesAgo(7200),
    updatedAt: minutesAgo(120),
  },
  {
    id: "env_prod",
    projectId: "proj_001",
    name: "Production",
    type: "production",
    slug: "prod",
    status: "active",
    url: "https://nova-landing.com",
    branch: "main",
    isDefault: false,
    currentDeploymentId: "dep_001",
    autoDeploy: false,
    createdAt: minutesAgo(7200),
    updatedAt: minutesAgo(15),
  },
];

const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    id: "dep_001",
    projectId: "proj_001",
    environmentId: "env_prod",
    targetId: "target_001",
    type: "deploy",
    platform: "vercel",
    status: "live",
    currentPhase: "activate",
    url: "https://nova-landing.com",
    commitHash: "a1b2c3d",
    commitMessage: "feat: update hero section with new animation",
    branch: "main",
    changedFiles: 8,
    buildDurationMs: 32000,
    deployDurationMs: 12000,
    totalDurationMs: 44000,
    buildCacheHit: true,
    artifactSizeBytes: 4194304,
    imageTag: "registry/nova-landing:a1b2c3d",
    healthCheckUrl: "https://nova-landing.com/api/health",
    healthCheckStatus: "passed",
    artifactId: "art_001",
    deployedBy: "user_001",
    createdAt: minutesAgo(15),
    completedAt: minutesAgo(14),
  },
  {
    id: "dep_002",
    projectId: "proj_001",
    environmentId: "env_prod",
    targetId: "target_001",
    type: "deploy",
    platform: "vercel",
    status: "live",
    url: "https://nova-landing.com",
    commitHash: "e4f5g6h",
    commitMessage: "fix: responsive layout on mobile devices",
    branch: "main",
    changedFiles: 3,
    buildDurationMs: 28000,
    deployDurationMs: 10000,
    totalDurationMs: 38000,
    buildCacheHit: true,
    artifactSizeBytes: 4089446,
    healthCheckStatus: "passed",
    deployedBy: "user_001",
    createdAt: minutesAgo(180),
    completedAt: minutesAgo(179),
  },
  {
    id: "dep_003",
    projectId: "proj_001",
    environmentId: "env_preview",
    targetId: "target_002",
    type: "deploy",
    platform: "vercel",
    status: "live",
    currentPhase: "activate",
    url: "https://nova-landing-preview.nova-studio.app",
    commitHash: "i7j8k9l",
    commitMessage: "feat: add pricing section with toggle",
    branch: "main",
    changedFiles: 5,
    buildDurationMs: 35000,
    deployDurationMs: 11000,
    totalDurationMs: 46000,
    buildCacheHit: false,
    artifactSizeBytes: 4299162,
    healthCheckStatus: "passed",
    deployedBy: "user_001",
    createdAt: minutesAgo(120),
    completedAt: minutesAgo(119),
  },
  {
    id: "dep_004",
    projectId: "proj_001",
    environmentId: "env_prod",
    targetId: "target_001",
    type: "rollback",
    platform: "vercel",
    status: "live",
    url: "https://nova-landing.com",
    commitHash: "e4f5g6h",
    commitMessage: "fix: responsive layout on mobile devices",
    branch: "main",
    buildDurationMs: 0,
    deployDurationMs: 8000,
    totalDurationMs: 8000,
    buildCacheHit: true,
    rollbackFromId: "dep_001",
    rollbackToId: "dep_002",
    healthCheckStatus: "passed",
    deployedBy: "user_001",
    createdAt: minutesAgo(360),
    completedAt: minutesAgo(359),
  },
  {
    id: "dep_005",
    projectId: "proj_001",
    environmentId: "env_dev",
    targetId: "target_003",
    type: "deploy",
    platform: "docker",
    status: "failed",
    currentPhase: "build",
    commitHash: "m0n1o2p",
    commitMessage: "wip: experiment with new layout",
    branch: "develop",
    changedFiles: 12,
    buildDurationMs: 15000,
    errorMessage: "Build failed: Module not found 'framer-motion'",
    deployedBy: "user_001",
    createdAt: minutesAgo(300),
    completedAt: minutesAgo(299),
  },
];

const MOCK_TARGETS: DeployTarget[] = [
  {
    id: "target_001",
    environmentId: "env_prod",
    platform: "vercel",
    platformConfig: { projectId: "prj_abc123", teamId: "team_nova", tokenMasked: "vercel_***x9f2" },
    isActive: true,
    createdAt: minutesAgo(14400),
    updatedAt: minutesAgo(7200),
  },
  {
    id: "target_002",
    environmentId: "env_preview",
    platform: "vercel",
    platformConfig: { projectId: "prj_abc123", teamId: "team_nova", tokenMasked: "vercel_***x9f2" },
    isActive: true,
    createdAt: minutesAgo(7200),
    updatedAt: minutesAgo(120),
  },
  {
    id: "target_003",
    environmentId: "env_dev",
    platform: "docker",
    platformConfig: { registryUrl: "registry.nova-studio.app", sshHost: "deploy.nova-studio.app", sshKeyMasked: "ssh-rsa ***", port: 3000 },
    isActive: true,
    createdAt: minutesAgo(14400),
    updatedAt: minutesAgo(60),
  },
];

const MOCK_DOMAINS: CustomDomain[] = [
  {
    id: "dom_001",
    environmentId: "env_prod",
    domain: "nova-landing.com",
    type: "custom",
    cnameTarget: "nova-landing-target.nova-studio.app",
    sslStatus: "active",
    sslProvider: "letsencrypt",
    sslIssuedAt: minutesAgo(7200),
    sslExpiresAt: daysFromNow(60),
    status: "active",
    verifiedAt: minutesAgo(7200),
    createdAt: minutesAgo(7200),
    updatedAt: minutesAgo(15),
  },
  {
    id: "dom_002",
    environmentId: "env_prod",
    domain: "www.nova-landing.com",
    type: "custom",
    cnameTarget: "nova-landing-target.nova-studio.app",
    sslStatus: "active",
    sslProvider: "letsencrypt",
    sslIssuedAt: minutesAgo(7200),
    sslExpiresAt: daysFromNow(58),
    status: "active",
    verifiedAt: minutesAgo(7200),
    createdAt: minutesAgo(7200),
    updatedAt: minutesAgo(15),
  },
  {
    id: "dom_003",
    environmentId: "env_prod",
    domain: "nova-landing-prod.nova-studio.app",
    type: "subdomain",
    cnameTarget: "auto",
    sslStatus: "active",
    sslProvider: "letsencrypt",
    sslIssuedAt: minutesAgo(14400),
    sslExpiresAt: daysFromNow(75),
    status: "active",
    verifiedAt: minutesAgo(14400),
    createdAt: minutesAgo(14400),
    updatedAt: minutesAgo(14400),
  },
];

const MOCK_ENV_VARS: EnvironmentVariable[] = [
  { id: "ev1", environmentId: "env_prod", key: "DATABASE_URL", valueMasked: "postgresql://nova:***@db.nova-studio.app:5432/nova", isSecret: true, createdAt: minutesAgo(14400), updatedAt: minutesAgo(60) },
  { id: "ev2", environmentId: "env_prod", key: "NEXT_PUBLIC_API_URL", value: "https://api.nova-landing.com", isSecret: false, createdAt: minutesAgo(14400), updatedAt: minutesAgo(7200) },
  { id: "ev3", environmentId: "env_prod", key: "STRIPE_SECRET_KEY", valueMasked: "sk_live_***x9f2", isSecret: true, createdAt: minutesAgo(7200), updatedAt: minutesAgo(120) },
  { id: "ev4", environmentId: "env_prod", key: "OPENAI_API_KEY", valueMasked: "sk-***", isSecret: true, createdAt: minutesAgo(3600), updatedAt: minutesAgo(30) },
  { id: "ev5", environmentId: "env_prod", key: "NEXT_PUBLIC_GA_ID", value: "G-XXXXXXXXXX", isSecret: false, createdAt: minutesAgo(7200), updatedAt: minutesAgo(7200) },
];

const MOCK_BUILD_LOGS: Record<string, BuildLog[]> = {
  dep_001: [
    { id: "bl1", deploymentId: "dep_001", phase: "pre-deploy", level: "info", source: "system", message: "Validating deployment permissions...", timestamp: minutesAgo(15) },
    { id: "bl2", deploymentId: "dep_001", phase: "pre-deploy", level: "info", source: "system", message: "✓ Permissions validated. No in-progress deployment found.", timestamp: minutesAgo(14.95) },
    { id: "bl3", deploymentId: "dep_001", phase: "install", level: "info", source: "build", message: "Running pnpm install...", timestamp: minutesAgo(14.9) },
    { id: "bl4", deploymentId: "dep_001", phase: "install", level: "info", source: "build", message: "Lockfile up to date, resolving... (cached)", timestamp: minutesAgo(14.85) },
    { id: "bl5", deploymentId: "dep_001", phase: "install", level: "info", source: "build", message: "✓ Dependencies installed (312 packages, cache hit)", timestamp: minutesAgo(14.7), metadata: { durationMs: 12000 } },
    { id: "bl6", deploymentId: "dep_001", phase: "build", level: "info", source: "build", message: "Running next build...", timestamp: minutesAgo(14.6) },
    { id: "bl7", deploymentId: "dep_001", phase: "build", level: "info", source: "build", message: "  ▲ Next.js 15.0.0", timestamp: minutesAgo(14.5) },
    { id: "bl8", deploymentId: "dep_001", phase: "build", level: "info", source: "build", message: "  Creating an optimized production build...", timestamp: minutesAgo(14.5) },
    { id: "bl9", deploymentId: "dep_001", phase: "build", level: "info", source: "build", message: "  ✓ Compiled successfully", timestamp: minutesAgo(14.3) },
    { id: "bl10", deploymentId: "dep_001", phase: "build", level: "info", source: "build", message: "  ✓ Building static pages (12/12)", timestamp: minutesAgo(14.2) },
    { id: "bl11", deploymentId: "dep_001", phase: "build", level: "warn", source: "build", message: "  ⚠ Image optimization may increase build time for /hero-bg.jpg", timestamp: minutesAgo(14.1) },
    { id: "bl12", deploymentId: "dep_001", phase: "build", level: "info", source: "build", message: "  ✓ Build completed", timestamp: minutesAgo(14.0), metadata: { durationMs: 32000 } },
    { id: "bl13", deploymentId: "dep_001", phase: "post-build", level: "info", source: "build", message: "Packaging build artifacts...", timestamp: minutesAgo(13.95) },
    { id: "bl14", deploymentId: "dep_001", phase: "post-build", level: "info", source: "build", message: "✓ Artifact uploaded (4.0 MB, sha256:a1b2c3d...)", timestamp: minutesAgo(13.9) },
    { id: "bl15", deploymentId: "dep_001", phase: "deploy", level: "info", source: "deploy", message: "Deploying to Vercel...", timestamp: minutesAgo(13.85) },
    { id: "bl16", deploymentId: "dep_001", phase: "deploy", level: "info", source: "deploy", message: "  → POST /v13/deployments (production)", timestamp: minutesAgo(13.8) },
    { id: "bl17", deploymentId: "dep_001", phase: "deploy", level: "info", source: "deploy", message: "  → Waiting for deployment to be READY...", timestamp: minutesAgo(13.7) },
    { id: "bl18", deploymentId: "dep_001", phase: "deploy", level: "info", source: "deploy", message: "✓ Deployment live at https://nova-landing.com", timestamp: minutesAgo(13.6) },
    { id: "bl19", deploymentId: "dep_001", phase: "domain", level: "info", source: "deploy", message: "Configuring custom domain: nova-landing.com", timestamp: minutesAgo(13.55) },
    { id: "bl20", deploymentId: "dep_001", phase: "domain", level: "info", source: "deploy", message: "✓ SSL certificate verified (Let's Encrypt, expires in 60 days)", timestamp: minutesAgo(13.5) },
    { id: "bl21", deploymentId: "dep_001", phase: "health", level: "info", source: "deploy", message: "Running health checks...", timestamp: minutesAgo(13.45) },
    { id: "bl22", deploymentId: "dep_001", phase: "health", level: "info", source: "deploy", message: "  GET https://nova-landing.com/api/health → 200 OK (12ms)", timestamp: minutesAgo(13.4) },
    { id: "bl23", deploymentId: "dep_001", phase: "health", level: "info", source: "deploy", message: "  GET https://nova-landing.com/api/health → 200 OK (8ms)", timestamp: minutesAgo(13.35) },
    { id: "bl24", deploymentId: "dep_001", phase: "health", level: "info", source: "deploy", message: "  GET https://nova-landing.com/api/health → 200 OK (10ms)", timestamp: minutesAgo(13.3) },
    { id: "bl25", deploymentId: "dep_001", phase: "health", level: "info", source: "deploy", message: "✓ Health checks passed (3/3)", timestamp: minutesAgo(13.25) },
    { id: "bl26", deploymentId: "dep_001", phase: "activate", level: "info", source: "system", message: "Activating deployment...", timestamp: minutesAgo(13.2) },
    { id: "bl27", deploymentId: "dep_001", phase: "activate", level: "info", source: "system", message: "✓ Traffic switched to new deployment", timestamp: minutesAgo(13.15) },
    { id: "bl28", deploymentId: "dep_001", phase: "activate", level: "info", source: "system", message: "✓ Deployment completed successfully!", timestamp: minutesAgo(13.1) },
  ],
  dep_005: [
    { id: "blf1", deploymentId: "dep_005", phase: "pre-deploy", level: "info", source: "system", message: "Validating deployment permissions...", timestamp: minutesAgo(300) },
    { id: "blf2", deploymentId: "dep_005", phase: "install", level: "info", source: "build", message: "Running pnpm install...", timestamp: minutesAgo(299.9) },
    { id: "blf3", deploymentId: "dep_005", phase: "install", level: "info", source: "build", message: "✓ Dependencies installed (318 packages)", timestamp: minutesAgo(299.7) },
    { id: "blf4", deploymentId: "dep_005", phase: "build", level: "info", source: "build", message: "Running next build...", timestamp: minutesAgo(299.6) },
    { id: "blf5", deploymentId: "dep_005", phase: "build", level: "error", source: "build", message: "Module not found: Can't resolve 'framer-motion' in '/src/components/Hero.tsx'", timestamp: minutesAgo(299.5), metadata: { file: "/src/components/Hero.tsx", line: 3 } },
    { id: "blf6", deploymentId: "dep_005", phase: "build", level: "error", source: "build", message: "Build failed. See error above.", timestamp: minutesAgo(299.4) },
  ],
};

const MOCK_DEPLOY_CONFIG: DeployConfig = {
  buildCommand: "next build",
  outputDir: ".next",
  installCommand: "pnpm install",
  nodeVersion: "20.11.0",
  resourceLimits: { cpu: 2, memoryMb: 2048 },
  buildTimeout: 600,
  healthCheckPath: "/api/health",
};

// ═══════════════════════════════════════════════════════════════
// 部署模拟器 — 模拟 9 阶段部署流程
// ═══════════════════════════════════════════════════════════════

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

const PHASE_SEQUENCE: DeployStatus[] = [
  "queued",
  "validating",
  "preparing",
  "building",
  "packaging",
  "deploying",
  "configuring",
  "activating",
  "live",
];

const PHASE_TO_LOG_PHASE: Record<DeployStatus, DeployPhase> = {
  queued: "pre-deploy",
  validating: "pre-deploy",
  preparing: "pre-deploy",
  building: "build",
  packaging: "post-build",
  deploying: "deploy",
  configuring: "domain",
  activating: "activate",
  live: "activate",
  failed: "build",
  cancelled: "pre-deploy",
};

const PHASE_LOG_MESSAGES: Record<DeployStatus, { message: string; level: "info" | "warn" | "error" }[]> = {
  queued: [{ message: "Deployment queued...", level: "info" }],
  validating: [
    { message: "Validating deployment permissions...", level: "info" },
    { message: "✓ Permissions validated. No in-progress deployment found.", level: "info" },
  ],
  preparing: [
    { message: "Preparing source files from VFS...", level: "info" },
    { message: "✓ Source files exported (24 files)", level: "info" },
    { message: "Injecting environment variables...", level: "info" },
  ],
  building: [
    { message: "Running pnpm install... (cache hit)", level: "info" },
    { message: "✓ Dependencies installed (312 packages)", level: "info" },
    { message: "Running next build...", level: "info" },
    { message: "  ▲ Next.js 15.0.0", level: "info" },
    { message: "  Creating an optimized production build...", level: "info" },
    { message: "  ✓ Compiled successfully", level: "info" },
    { message: "  ✓ Building static pages (12/12)", level: "info" },
    { message: "✓ Build completed", level: "info" },
  ],
  packaging: [
    { message: "Packaging build artifacts...", level: "info" },
    { message: "✓ Artifact uploaded (4.0 MB)", level: "info" },
  ],
  deploying: [
    { message: "Deploying to platform...", level: "info" },
    { message: "  → Uploading build artifacts...", level: "info" },
    { message: "  → Waiting for deployment to be READY...", level: "info" },
    { message: "✓ Deployment is live", level: "info" },
  ],
  configuring: [
    { message: "Configuring domain & SSL...", level: "info" },
    { message: "✓ SSL certificate verified", level: "info" },
  ],
  activating: [
    { message: "Running health checks...", level: "info" },
    { message: "  GET /api/health → 200 OK", level: "info" },
    { message: "  GET /api/health → 200 OK", level: "info" },
    { message: "  GET /api/health → 200 OK", level: "info" },
    { message: "✓ Health checks passed (3/3)", level: "info" },
    { message: "✓ Traffic switched to new deployment", level: "info" },
    { message: "✓ Deployment completed successfully!", level: "info" },
  ],
  live: [],
  failed: [{ message: "✗ Build failed", level: "error" }],
  cancelled: [{ message: "Deployment cancelled by user", level: "warn" }],
};

// ═══════════════════════════════════════════════════════════════
// Store 实现
// ═══════════════════════════════════════════════════════════════

export const useDeployStore = create<DeployStore>((set, get) => ({
  // ═══ 初始 State ═══
  activeView: "overview",
  environments: MOCK_ENVIRONMENTS,
  activeEnvironmentId: "env_prod",
  deployments: MOCK_DEPLOYMENTS,
  deployTargets: MOCK_TARGETS,
  customDomains: MOCK_DOMAINS,
  buildLogs: MOCK_BUILD_LOGS,
  environmentVariables: MOCK_ENV_VARS,
  deployConfig: MOCK_DEPLOY_CONFIG,
  selectedPlatform: "vercel",
  selectedDeploymentId: "dep_001",
  isDeploying: false,

  // ═══ Actions ═══
  setActiveView: (view) => set({ activeView: view }),
  setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setSelectedDeployment: (id) => set({ selectedDeploymentId: id }),

  createDeployment: (platform, type = "deploy") => {
    const state = get();
    const envId = state.activeEnvironmentId;
    if (!envId) return;
    const env = state.environments.find((e) => e.id === envId);
    if (!env) return;

    const depId = genId("dep");
    const newDeployment: Deployment = {
      id: depId,
      projectId: "proj_001",
      environmentId: envId,
      targetId: state.deployTargets.find((t) => t.environmentId === envId)?.id,
      type,
      platform,
      status: "queued",
      currentPhase: "pre-deploy",
      commitHash: Math.random().toString(36).slice(2, 9),
      commitMessage: type === "rollback" ? "Rollback to previous version" : `Deploy ${env.name} environment`,
      branch: env.branch ?? "main",
      changedFiles: Math.floor(Math.random() * 15) + 1,
      healthCheckStatus: "pending",
      deployedBy: "user_001",
      createdAt: now(),
    };

    set((s) => ({
      deployments: [newDeployment, ...s.deployments],
      isDeploying: true,
      selectedDeploymentId: depId,
      buildLogs: { ...s.buildLogs, [depId]: [] },
    }));

    // 模拟 9 阶段部署流程
    const phases = PHASE_SEQUENCE;
    let phaseIndex = 0;

    const runPhase = () => {
      if (phaseIndex >= phases.length) {
        set((s) => ({
          isDeploying: false,
          deployments: s.deployments.map((d) =>
            d.id === depId
              ? {
                  ...d,
                  status: "live",
                  url: `https://nova-landing-${env.slug}.nova-studio.app`,
                  buildDurationMs: 32000,
                  deployDurationMs: 12000,
                  totalDurationMs: 44000,
                  buildCacheHit: true,
                  artifactSizeBytes: 4194304,
                  healthCheckStatus: "passed",
                  completedAt: now(),
                }
              : d,
          ),
          environments: s.environments.map((e) =>
            e.id === envId ? { ...e, currentDeploymentId: depId } : e,
          ),
        }));
        return;
      }

      const phaseStatus = phases[phaseIndex];
      const logPhase = PHASE_TO_LOG_PHASE[phaseStatus];

      // 更新部署状态
      set((s) => ({
        deployments: s.deployments.map((d) =>
          d.id === depId ? { ...d, status: phaseStatus, currentPhase: logPhase } : d,
        ),
      }));

      // 添加该阶段的日志
      const logs = PHASE_LOG_MESSAGES[phaseStatus] ?? [];
      logs.forEach((logMsg, i) => {
        setTimeout(() => {
          set((s) => ({
            buildLogs: {
              ...s.buildLogs,
              [depId]: [
                ...(s.buildLogs[depId] ?? []),
                {
                  id: genId("bl"),
                  deploymentId: depId,
                  phase: logPhase,
                  level: logMsg.level,
                  source: phaseStatus === "deploying" || phaseStatus === "configuring" ? "deploy" : phaseStatus === "building" || phaseStatus === "packaging" || phaseStatus === "preparing" ? "build" : "system",
                  message: logMsg.message,
                  timestamp: now(),
                },
              ],
            },
          }));
        }, i * 200);
      });

      phaseIndex++;
      setTimeout(runPhase, 1500);
    };

    setTimeout(runPhase, 300);
  },

  cancelDeployment: (id) => {
    set((s) => ({
      deployments: s.deployments.map((d) =>
        d.id === id ? { ...d, status: "cancelled", completedAt: now() } : d,
      ),
      isDeploying: false,
    }));
  },

  rollbackDeployment: (targetDeploymentId) => {
    const state = get();
    const target = state.deployments.find((d) => d.id === targetDeploymentId);
    if (!target) return;
    const envId = state.activeEnvironmentId!;

    const rollbackDep: Deployment = {
      id: genId("dep"),
      projectId: "proj_001",
      environmentId: envId,
      type: "rollback",
      platform: target.platform,
      status: "live",
      url: target.url,
      commitHash: target.commitHash,
      commitMessage: target.commitMessage,
      branch: target.branch,
      buildDurationMs: 0,
      deployDurationMs: 8000,
      totalDurationMs: 8000,
      buildCacheHit: true,
      rollbackFromId: state.environments.find((e) => e.id === envId)?.currentDeploymentId,
      rollbackToId: targetDeploymentId,
      healthCheckStatus: "passed",
      deployedBy: "user_001",
      createdAt: now(),
      completedAt: now(),
    };

    set((s) => ({
      deployments: [rollbackDep, ...s.deployments],
      environments: s.environments.map((e) =>
        e.id === envId ? { ...e, currentDeploymentId: rollbackDep.id } : e,
      ),
    }));
  },

  promoteDeployment: (sourceDeploymentId) => {
    const state = get();
    const source = state.deployments.find((d) => d.id === sourceDeploymentId);
    if (!source) return;
    const prodEnv = state.environments.find((e) => e.type === "production");
    if (!prodEnv) return;

    const promotedDep: Deployment = {
      id: genId("dep"),
      projectId: "proj_001",
      environmentId: prodEnv.id,
      type: "promote",
      platform: source.platform,
      status: "live",
      url: prodEnv.url,
      commitHash: source.commitHash,
      commitMessage: source.commitMessage,
      branch: source.branch,
      buildDurationMs: 0,
      deployDurationMs: 12000,
      totalDurationMs: 12000,
      buildCacheHit: true,
      artifactId: source.artifactId,
      healthCheckStatus: "passed",
      deployedBy: "user_001",
      createdAt: now(),
      completedAt: now(),
    };

    set((s) => ({
      deployments: [promotedDep, ...s.deployments],
      environments: s.environments.map((e) =>
        e.id === prodEnv.id ? { ...e, currentDeploymentId: promotedDep.id } : e,
      ),
    }));
  },

  redeploy: (deploymentId) => {
    const state = get();
    const original = state.deployments.find((d) => d.id === deploymentId);
    if (!original) return;
    get().createDeployment(original.platform, "deploy");
  },

  addDomain: (domain) => {
    const envId = get().activeEnvironmentId!;
    const newDomain: CustomDomain = {
      id: genId("dom"),
      environmentId: envId,
      domain,
      type: "custom",
      cnameTarget: `${genId("target")}.nova-studio.app`,
      sslStatus: "pending",
      sslProvider: "letsencrypt",
      status: "pending",
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ customDomains: [...s.customDomains, newDomain] }));
  },

  removeDomain: (id) => {
    set((s) => ({ customDomains: s.customDomains.filter((d) => d.id !== id) }));
  },

  verifyDomain: (id) => {
    set((s) => ({
      customDomains: s.customDomains.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "active",
              sslStatus: "active",
              sslProvider: "letsencrypt",
              sslIssuedAt: now(),
              sslExpiresAt: daysFromNow(90),
              verifiedAt: now(),
              updatedAt: now(),
            }
          : d,
      ),
    }));
  },

  addEnvironmentVariable: (key, value, isSecret) => {
    const envId = get().activeEnvironmentId!;
    const newVar: EnvironmentVariable = {
      id: genId("ev"),
      environmentId: envId,
      key,
      value: isSecret ? undefined : value,
      valueMasked: isSecret ? `${value.slice(0, 4)}***${value.slice(-3)}` : undefined,
      isSecret,
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ environmentVariables: [...s.environmentVariables, newVar] }));
  },

  removeEnvironmentVariable: (id) => {
    set((s) => ({ environmentVariables: s.environmentVariables.filter((v) => v.id !== id) }));
  },

  updateDeployConfig: (config) => {
    set((s) => ({ deployConfig: { ...s.deployConfig, ...config } }));
  },

  loadMockData: () => {
    set({
      environments: MOCK_ENVIRONMENTS,
      deployments: MOCK_DEPLOYMENTS,
      deployTargets: MOCK_TARGETS,
      customDomains: MOCK_DOMAINS,
      buildLogs: MOCK_BUILD_LOGS,
      environmentVariables: MOCK_ENV_VARS,
      deployConfig: MOCK_DEPLOY_CONFIG,
    });
  },
}));
