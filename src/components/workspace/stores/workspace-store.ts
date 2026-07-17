// ═══════════════════════════════════════════════════════════════
// Workspace Store — Project Workspace 核心状态管理 (Zustand)
// ═══════════════════════════════════════════════════════════════

"use client";

import { create } from "zustand";
import type {
  ApiEndpoint,
  AuthConfig,
  BillingInfo,
  DatabaseConnection,
  Deployment,
  Environment,
  EnvironmentVariable,
  FolderNode,
  GitConnection,
  GitSync,
  HistoryEntry,
  LogEntry,
  Project,
  StorageBucket,
  StorageObject,
  TerminalSession,
  WorkspaceTab,
} from "../types";

// ═══════════════════════════════════════════════════════════════
// Store 接口
// ═══════════════════════════════════════════════════════════════

interface WorkspaceStore {
  // ═══ State ═══
  activeTab: WorkspaceTab;
  currentProject: Project | null;
  environments: Environment[];
  activeEnvironmentId: string | null;
  folders: FolderNode[];
  deployments: Deployment[];
  logs: LogEntry[];
  gitConnection: GitConnection | null;
  gitSyncs: GitSync[];
  terminalSessions: TerminalSession[];
  databaseConnections: DatabaseConnection[];
  storageBuckets: StorageBucket[];
  storageObjects: StorageObject[];
  apiEndpoints: ApiEndpoint[];
  authConfigs: AuthConfig[];
  history: HistoryEntry[];
  billing: BillingInfo | null;

  // ═══ Actions ═══
  setActiveTab: (tab: WorkspaceTab) => void;
  setActiveEnvironment: (id: string) => void;
  createEnvironment: (env: Omit<Environment, "id" | "createdAt" | "updatedAt">) => void;
  deleteEnvironment: (id: string) => void;
  updateEnvironmentVariable: (envId: string, key: string, value: string, isSecret: boolean) => void;
  addFolder: (parentId: string | null, name: string, type: "folder" | "file") => void;
  deleteFolder: (id: string) => void;
  createDeployment: (environmentId: string, platform: string) => void;
  addLog: (log: Omit<LogEntry, "id" | "timestamp">) => void;
  clearLogs: () => void;
  connectGit: (repoFullName: string, branch: string) => void;
  syncGit: (direction: "push" | "pull") => void;
  executeTerminal: (command: string) => string;
  connectDatabase: (id: string) => void;
  uploadStorageObject: (bucketId: string, fileName: string, size: number) => void;
  toggleAuthProvider: (provider: string) => void;
  loadMockData: () => void;
}

// ═══════════════════════════════════════════════════════════════
// Mock Data
// ═══════════════════════════════════════════════════════════════

const now = new Date().toISOString();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const MOCK_PROJECT: Project = {
  id: "proj_001",
  workspaceId: "ws_001",
  name: "Nova Landing",
  slug: "nova-landing",
  description: "Marketing website for Nova Studio",
  type: "landing_page",
  framework: "nextjs",
  status: "active",
  createdBy: "user_001",
  createdAt: minutesAgo(14400),
  updatedAt: minutesAgo(30),
};

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
    config: { buildCommand: "npm run build", outputDir: ".next" },
    createdBy: "user_001",
    createdAt: minutesAgo(14400),
    updatedAt: minutesAgo(60),
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
    config: { buildCommand: "npm run build", outputDir: ".next" },
    createdBy: "user_001",
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
    config: { buildCommand: "npm run build", outputDir: ".next", cdn: true },
    createdBy: "user_001",
    createdAt: minutesAgo(7200),
    updatedAt: minutesAgo(15),
  },
];

const MOCK_FOLDERS: FolderNode[] = [
  { id: "f1", projectId: "proj_001", parentId: null, name: "src", path: "/src", type: "folder", size: 0, sortOrder: 0, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f2", projectId: "proj_001", parentId: "f1", name: "app", path: "/src/app", type: "folder", size: 0, sortOrder: 0, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f3", projectId: "proj_001", parentId: "f2", name: "page.tsx", path: "/src/app/page.tsx", type: "file", fileType: "tsx", size: 4200, content: "export default function Page() { return <div>Hello</div>; }", sortOrder: 0, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f4", projectId: "proj_001", parentId: "f2", name: "layout.tsx", path: "/src/app/layout.tsx", type: "file", fileType: "tsx", size: 1800, content: "export const metadata = { title: 'Nova' };", sortOrder: 1, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f5", projectId: "proj_001", parentId: "f1", name: "components", path: "/src/components", type: "folder", size: 0, sortOrder: 1, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f6", projectId: "proj_001", parentId: "f5", name: "Hero.tsx", path: "/src/components/Hero.tsx", type: "file", fileType: "tsx", size: 3200, content: "export function Hero() { return <section>Hero</section>; }", sortOrder: 0, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f7", projectId: "proj_001", parentId: null, name: "package.json", path: "/package.json", type: "file", fileType: "json", size: 1200, content: '{ "name": "nova-landing" }', sortOrder: 1, isHidden: false, createdAt: now, updatedAt: now },
  { id: "f8", projectId: "proj_001", parentId: null, name: "README.md", path: "/README.md", type: "file", fileType: "md", size: 800, content: "# Nova Landing", sortOrder: 2, isHidden: false, createdAt: now, updatedAt: now },
];

const MOCK_DEPLOYMENTS: Deployment[] = [
  { id: "d1", projectId: "proj_001", environmentId: "env_prod", platform: "vercel", status: "live", url: "https://nova-landing.com", commitHash: "a1b2c3d", commitMessage: "feat: update hero section", buildDurationMs: 45000, deployedBy: "user_001", createdAt: minutesAgo(15), completedAt: minutesAgo(14) },
  { id: "d2", projectId: "proj_001", environmentId: "env_preview", platform: "vercel", status: "live", url: "https://nova-landing-preview.nova-studio.app", commitHash: "e4f5g6h", commitMessage: "fix: responsive layout", buildDurationMs: 38000, deployedBy: "user_001", createdAt: minutesAgo(120), completedAt: minutesAgo(119) },
  { id: "d3", projectId: "proj_001", environmentId: "env_dev", platform: "vercel", status: "failed", commitHash: "i7j8k9l", commitMessage: "wip: experiment", buildDurationMs: 12000, deployedBy: "user_001", createdAt: minutesAgo(300), completedAt: minutesAgo(299) },
];

const MOCK_LOGS: LogEntry[] = [
  { id: "l1", environmentId: "env_prod", deploymentId: "d1", level: "info", source: "build", message: "Cloning repository...", timestamp: minutesAgo(15) },
  { id: "l2", environmentId: "env_prod", deploymentId: "d1", level: "info", source: "build", message: "Installing dependencies (pnpm install)...", timestamp: minutesAgo(14.8) },
  { id: "l3", environmentId: "env_prod", deploymentId: "d1", level: "info", source: "build", message: "Running build command: next build", timestamp: minutesAgo(14.5) },
  { id: "l4", environmentId: "env_prod", deploymentId: "d1", level: "warn", source: "build", message: "Image optimization may increase build time", timestamp: minutesAgo(14.2) },
  { id: "l5", environmentId: "env_prod", deploymentId: "d1", level: "info", source: "deploy", message: "Uploading build artifacts to Vercel...", timestamp: minutesAgo(14) },
  { id: "l6", environmentId: "env_prod", deploymentId: "d1", level: "info", source: "deploy", message: "Deployment live at https://nova-landing.com", timestamp: minutesAgo(13.9) },
  { id: "l7", environmentId: "env_dev", level: "error", source: "runtime", message: "TypeError: Cannot read property 'map' of undefined", timestamp: minutesAgo(5) },
  { id: "l8", environmentId: "env_dev", level: "warn", source: "runtime", message: "API rate limit approaching (80%)", timestamp: minutesAgo(3) },
];

const MOCK_GIT: GitConnection = {
  id: "git1",
  projectId: "proj_001",
  provider: "github",
  repoId: "123456789",
  repoFullName: "nova-studio/landing",
  defaultBranch: "main",
  connectedBy: "user_001",
  createdAt: minutesAgo(14400),
  updatedAt: minutesAgo(7200),
};

const MOCK_GIT_SYNCS: GitSync[] = [
  { id: "gs1", gitConnectionId: "git1", direction: "push", branch: "main", commitHash: "a1b2c3d", commitMessage: "feat: update hero section", status: "synced", syncedBy: "user_001", createdAt: minutesAgo(15), completedAt: minutesAgo(14.5) },
  { id: "gs2", gitConnectionId: "git1", direction: "pull", branch: "main", commitHash: "e4f5g6h", commitMessage: "fix: responsive layout", status: "synced", syncedBy: "user_001", createdAt: minutesAgo(120), completedAt: minutesAgo(119.5) },
];

const MOCK_DB_CONNS: DatabaseConnection[] = [
  { id: "db1", environmentId: "env_prod", name: "Primary DB", engine: "postgres", host: "db.nova-studio.internal", port: 5432, databaseName: "nova_landing", username: "nova_app", connectionStringMasked: "postgresql://nova_app:***@db.nova-studio.internal:5432/nova_landing", status: "connected", poolSize: 10, sslMode: "require", createdAt: minutesAgo(14400), updatedAt: minutesAgo(60) },
  { id: "db2", environmentId: "env_dev", name: "Dev DB", engine: "postgres", host: "localhost", port: 5432, databaseName: "nova_dev", username: "postgres", connectionStringMasked: "postgresql://postgres:***@localhost:5432/nova_dev", status: "connected", poolSize: 5, sslMode: "disable", createdAt: minutesAgo(14400), updatedAt: minutesAgo(120) },
];

const MOCK_STORAGE: StorageBucket[] = [
  { id: "sb1", environmentId: "env_prod", name: "Uploads", provider: "s3", bucketName: "nova-uploads", region: "us-east-1", publicUrlBase: "https://cdn.nova-landing.com", totalSizeBytes: 524288000, fileCount: 342, createdAt: minutesAgo(14400), updatedAt: minutesAgo(30) },
  { id: "sb2", environmentId: "env_prod", name: "Assets", provider: "s3", bucketName: "nova-assets", region: "us-east-1", publicUrlBase: "https://assets.nova-landing.com", totalSizeBytes: 1073741824, fileCount: 89, createdAt: minutesAgo(14400), updatedAt: minutesAgo(60) },
];

const MOCK_STORAGE_OBJECTS: StorageObject[] = [
  { id: "so1", bucketId: "sb1", key: "images/hero-bg.jpg", fileName: "hero-bg.jpg", contentType: "image/jpeg", sizeBytes: 245678, url: "https://cdn.nova-landing.com/images/hero-bg.jpg", isPublic: true, uploadedBy: "user_001", createdAt: minutesAgo(120) },
  { id: "so2", bucketId: "sb1", key: "images/logo.png", fileName: "logo.png", contentType: "image/png", sizeBytes: 45678, url: "https://cdn.nova-landing.com/images/logo.png", isPublic: true, uploadedBy: "user_001", createdAt: minutesAgo(240) },
  { id: "so3", bucketId: "sb2", key: "css/main.css", fileName: "main.css", contentType: "text/css", sizeBytes: 12345, url: "https://assets.nova-landing.com/css/main.css", isPublic: true, uploadedBy: "user_001", createdAt: minutesAgo(360) },
];

const MOCK_API_ENDPOINTS: ApiEndpoint[] = [
  { id: "api1", projectId: "proj_001", method: "GET", path: "/api/health", description: "Health check endpoint", authRequired: false, isActive: true, createdBy: "user_001", createdAt: minutesAgo(14400), updatedAt: minutesAgo(7200) },
  { id: "api2", projectId: "proj_001", method: "POST", path: "/api/leads", description: "Submit lead form", authRequired: false, rateLimit: 10, isActive: true, createdBy: "user_001", createdAt: minutesAgo(7200), updatedAt: minutesAgo(60) },
  { id: "api3", projectId: "proj_001", method: "GET", path: "/api/blog/posts", description: "List blog posts", authRequired: false, rateLimit: 60, isActive: true, createdBy: "user_001", createdAt: minutesAgo(3600), updatedAt: minutesAgo(30) },
  { id: "api4", projectId: "proj_001", method: "DELETE", path: "/api/admin/cache", description: "Clear cache (admin only)", authRequired: true, rateLimit: 5, isActive: true, createdBy: "user_001", createdAt: minutesAgo(1800), updatedAt: minutesAgo(1800) },
];

const MOCK_AUTH_CONFIGS: AuthConfig[] = [
  { id: "ac1", projectId: "proj_001", provider: "email", isEnabled: true, scopes: [], config: {}, createdAt: minutesAgo(14400), updatedAt: minutesAgo(7200) },
  { id: "ac2", projectId: "proj_001", provider: "github", isEnabled: true, clientId: "Iv1.abc123def456", redirectUrl: "https://nova-landing.com/api/auth/callback/github", scopes: ["user:email", "read:user"], config: {}, createdAt: minutesAgo(7200), updatedAt: minutesAgo(60) },
  { id: "ac3", projectId: "proj_001", provider: "google", isEnabled: false, clientId: "", redirectUrl: "", scopes: [], config: {}, createdAt: minutesAgo(3600), updatedAt: minutesAgo(3600) },
];

const MOCK_HISTORY: HistoryEntry[] = [
  { id: "h1", projectId: "proj_001", environmentId: "env_prod", action: "deploy", targetType: "deployment", targetId: "d1", targetName: "Production Deploy", description: "Deployed to production (commit a1b2c3d)", userId: "user_001", createdAt: minutesAgo(15) },
  { id: "h2", projectId: "proj_001", environmentId: "env_prod", action: "update", targetType: "file", targetId: "f3", targetName: "/src/app/page.tsx", description: "Updated hero section content", changes: { before: "old content", after: "new content" }, userId: "user_001", createdAt: minutesAgo(30) },
  { id: "h3", projectId: "proj_001", environmentId: "env_dev", action: "create", targetType: "environment_variable", targetName: "DATABASE_URL", description: "Added DATABASE_URL to Development", userId: "user_001", createdAt: minutesAgo(60) },
  { id: "h4", projectId: "proj_001", action: "config", targetType: "auth", targetName: "GitHub OAuth", description: "Enabled GitHub authentication", userId: "user_001", createdAt: minutesAgo(120) },
  { id: "h5", projectId: "proj_001", environmentId: "env_preview", action: "deploy", targetType: "deployment", targetId: "d2", targetName: "Preview Deploy", description: "Deployed to preview (commit e4f5g6h)", userId: "user_001", createdAt: minutesAgo(120) },
];

const MOCK_BILLING: BillingInfo = {
  plan: "pro",
  status: "active",
  currentPeriodStart: minutesAgo(43200),
  currentPeriodEnd: new Date(Date.now() + 43200 * 60000).toISOString(),
  stripeCustomerId: "cus_abc123",
  usage: {
    aiTokens: 850000,
    aiTokensLimit: 2000000,
    buildMinutes: 42,
    buildMinutesLimit: 300,
    bandwidthMb: 1280,
    bandwidthLimitMb: 10240,
    storageMb: 1560,
    storageLimitMb: 5120,
    deployments: 45,
    deploymentsLimit: 100,
  },
};

const MOCK_TERMINAL: TerminalSession[] = [
  { id: "t1", environmentId: "env_dev", userId: "user_001", status: "active", cwd: "/app", output: "Nova Studio Terminal v1.0\nType 'help' for available commands.\n\n", createdAt: minutesAgo(60) },
];

// ═══════════════════════════════════════════════════════════════
// Store 实现
// ═══════════════════════════════════════════════════════════════

function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  // ═══ 初始 State ═══
  activeTab: "overview",
  currentProject: MOCK_PROJECT,
  environments: MOCK_ENVIRONMENTS,
  activeEnvironmentId: "env_dev",
  folders: MOCK_FOLDERS,
  deployments: MOCK_DEPLOYMENTS,
  logs: MOCK_LOGS,
  gitConnection: MOCK_GIT,
  gitSyncs: MOCK_GIT_SYNCS,
  terminalSessions: MOCK_TERMINAL,
  databaseConnections: MOCK_DB_CONNS,
  storageBuckets: MOCK_STORAGE,
  storageObjects: MOCK_STORAGE_OBJECTS,
  apiEndpoints: MOCK_API_ENDPOINTS,
  authConfigs: MOCK_AUTH_CONFIGS,
  history: MOCK_HISTORY,
  billing: MOCK_BILLING,

  // ═══ Actions ═══
  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveEnvironment: (id) => set({ activeEnvironmentId: id }),

  createEnvironment: (env) => {
    const newEnv: Environment = {
      ...env,
      id: genId("env"),
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ environments: [...s.environments, newEnv] }));
  },

  deleteEnvironment: (id) => {
    set((s) => ({
      environments: s.environments.filter((e) => e.id !== id),
      activeEnvironmentId: s.activeEnvironmentId === id
        ? s.environments.find((e) => e.isDefault)?.id ?? null
        : s.activeEnvironmentId,
    }));
  },

  updateEnvironmentVariable: (envId, key, value, isSecret) => {
    // In a real app, this would call the API
    void envId; void key; void value; void isSecret;
  },

  addFolder: (parentId, name, type) => {
    const state = get();
    const parent = parentId ? state.folders.find((f) => f.id === parentId) : null;
    const path = parent ? `${parent.path}/${name}` : `/${name}`;
    const newNode: FolderNode = {
      id: genId("f"),
      projectId: state.currentProject?.id ?? "",
      parentId,
      name,
      path,
      type,
      size: 0,
      sortOrder: state.folders.filter((f) => f.parentId === parentId).length,
      isHidden: false,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ folders: [...s.folders, newNode] }));
  },

  deleteFolder: (id) => {
    set((s) => ({
      folders: s.folders.filter((f) => f.id !== id && f.parentId !== id),
    }));
  },

  createDeployment: (environmentId, platform) => {
    const state = get();
    const newDeploy: Deployment = {
      id: genId("d"),
      projectId: state.currentProject?.id ?? "",
      environmentId,
      platform: platform as Deployment["platform"],
      status: "queued",
      deployedBy: "user_001",
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ deployments: [newDeploy, ...s.deployments] }));

    // Simulate build progression
    setTimeout(() => {
      set((s) => ({
        deployments: s.deployments.map((d) =>
          d.id === newDeploy.id ? { ...d, status: "building" } : d,
        ),
      }));
    }, 500);
    setTimeout(() => {
      set((s) => ({
        deployments: s.deployments.map((d) =>
          d.id === newDeploy.id
            ? { ...d, status: "deploying" }
            : d,
        ),
      }));
    }, 1500);
    setTimeout(() => {
      const env = state.environments.find((e) => e.id === environmentId);
      set((s) => ({
        deployments: s.deployments.map((d) =>
          d.id === newDeploy.id
            ? {
                ...d,
                status: "live",
                url: `https://${state.currentProject?.slug}-${env?.slug}.nova-studio.app`,
                buildDurationMs: 35000,
                completedAt: new Date().toISOString(),
              }
            : d,
        ),
      }));
    }, 2500);
  },

  addLog: (log) => {
    const newLog: LogEntry = {
      ...log,
      id: genId("l"),
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ logs: [newLog, ...s.logs] }));
  },

  clearLogs: () => set({ logs: [] }),

  connectGit: (repoFullName, branch) => {
    const state = get();
    const conn: GitConnection = {
      id: genId("git"),
      projectId: state.currentProject?.id ?? "",
      provider: "github",
      repoFullName,
      defaultBranch: branch,
      connectedBy: "user_001",
      createdAt: now,
      updatedAt: now,
    };
    set({ gitConnection: conn });
  },

  syncGit: (direction) => {
    const state = get();
    if (!state.gitConnection) return;
    const sync: GitSync = {
      id: genId("gs"),
      gitConnectionId: state.gitConnection.id,
      direction,
      branch: state.gitConnection.defaultBranch,
      status: "syncing",
      syncedBy: "user_001",
      createdAt: now,
    };
    set((s) => ({ gitSyncs: [sync, ...s.gitSyncs] }));

    setTimeout(() => {
      set((s) => ({
        gitSyncs: s.gitSyncs.map((g) =>
          g.id === sync.id
            ? { ...g, status: "synced", commitHash: "z9y8x7w", completedAt: now }
            : g,
        ),
      }));
    }, 1500);
  },

  executeTerminal: (command) => {
    const state = get();
    const envId = state.activeEnvironmentId;
    if (!envId) return "";

    const outputs: Record<string, string> = {
      help: "Available commands: ls, pwd, whoami, date, echo, help",
      ls: "src/  package.json  README.md  next.config.js  tsconfig.json",
      pwd: "/app",
      whoami: "nova-user",
      date: new Date().toString(),
      echo: "",
    };

    const cmd = command.trim();
    let output: string;
    if (cmd.startsWith("echo ")) {
      output = cmd.slice(5);
    } else if (cmd === "ls") {
      output = outputs.ls;
    } else if (outputs[cmd]) {
      output = outputs[cmd];
    } else if (cmd === "") {
      output = "";
    } else {
      output = `command not found: ${cmd.split(" ")[0]}\nType 'help' for available commands.`;
    }

    const fullOutput = `$ ${command}\n${output}\n`;
    set((s) => ({
      terminalSessions: s.terminalSessions.map((t) =>
        t.environmentId === envId
          ? { ...t, output: t.output + fullOutput }
          : t,
      ),
    }));

    return output;
  },

  connectDatabase: (id) => {
    set((s) => ({
      databaseConnections: s.databaseConnections.map((db) =>
        db.id === id
          ? { ...db, status: db.status === "connected" ? "disconnected" : "connected" }
          : db,
      ),
    }));
  },

  uploadStorageObject: (bucketId, fileName, size) => {
    const state = get();
    const bucket = state.storageBuckets.find((b) => b.id === bucketId);
    if (!bucket) return;
    const obj: StorageObject = {
      id: genId("so"),
      bucketId,
      key: `uploads/${fileName}`,
      fileName,
      contentType: "application/octet-stream",
      sizeBytes: size,
      url: `${bucket.publicUrlBase}/uploads/${fileName}`,
      isPublic: false,
      uploadedBy: "user_001",
      createdAt: now,
    };
    set((s) => ({
      storageObjects: [obj, ...s.storageObjects],
      storageBuckets: s.storageBuckets.map((b) =>
        b.id === bucketId
          ? { ...b, fileCount: b.fileCount + 1, totalSizeBytes: b.totalSizeBytes + size }
          : b,
      ),
    }));
  },

  toggleAuthProvider: (provider) => {
    set((s) => ({
      authConfigs: s.authConfigs.map((ac) =>
        ac.provider === provider
          ? { ...ac, isEnabled: !ac.isEnabled, updatedAt: now }
          : ac,
      ),
    }));
  },

  loadMockData: () => {
    set({
      currentProject: MOCK_PROJECT,
      environments: MOCK_ENVIRONMENTS,
      folders: MOCK_FOLDERS,
      deployments: MOCK_DEPLOYMENTS,
      logs: MOCK_LOGS,
      gitConnection: MOCK_GIT,
      gitSyncs: MOCK_GIT_SYNCS,
      terminalSessions: MOCK_TERMINAL,
      databaseConnections: MOCK_DB_CONNS,
      storageBuckets: MOCK_STORAGE,
      storageObjects: MOCK_STORAGE_OBJECTS,
      apiEndpoints: MOCK_API_ENDPOINTS,
      authConfigs: MOCK_AUTH_CONFIGS,
      history: MOCK_HISTORY,
      billing: MOCK_BILLING,
    });
  },
}));
