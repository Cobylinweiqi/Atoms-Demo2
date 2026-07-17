-- ═══════════════════════════════════════════════════════════════
-- Project Workspace — SQL Schema (PostgreSQL 16)
-- 核心: Project 1:N Environment, 每个环境独立配置
-- ═══════════════════════════════════════════════════════════════

-- ─── ENUM 类型 ───

CREATE TYPE env_type AS ENUM ('development', 'preview', 'staging', 'production');
CREATE TYPE env_status AS ENUM ('active', 'sleeping', 'building', 'error');
CREATE TYPE folder_type AS ENUM ('folder', 'file');
CREATE TYPE deploy_status AS ENUM ('queued', 'building', 'deploying', 'live', 'failed', 'cancelled');
CREATE TYPE deploy_platform AS ENUM ('vercel', 'netlify', 'cloudflare', 'custom');
CREATE TYPE log_level AS ENUM ('debug', 'info', 'warn', 'error', 'fatal');
CREATE TYPE log_source AS ENUM ('build', 'runtime', 'deploy', 'terminal', 'system');
CREATE TYPE git_sync_status AS ENUM ('pending', 'syncing', 'synced', 'failed');
CREATE TYPE git_sync_direction AS ENUM ('push', 'pull');
CREATE TYPE db_engine AS ENUM ('postgres', 'mysql', 'sqlite', 'mongodb', 'redis');
CREATE TYPE db_conn_status AS ENUM ('connected', 'disconnected', 'error');
CREATE TYPE storage_provider AS ENUM ('s3', 'gcs', 'azure', 'local', 'cloudflare-r2');
CREATE TYPE api_method AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'github', 'apple', 'magic-link', 'saml');
CREATE TYPE billing_plan AS ENUM ('free', 'pro', 'team', 'enterprise');
CREATE TYPE billing_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');
CREATE TYPE history_action AS ENUM ('create', 'update', 'delete', 'deploy', 'rollback', 'config');

-- ═══════════════════════════════════════════════════════════════
-- 1. environments — 环境 (Project 1:N Environment)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE environments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name         VARCHAR(100) NOT NULL,           -- development / staging / production
    type         env_type NOT NULL DEFAULT 'development',
    slug         VARCHAR(100) NOT NULL,           -- dev / staging / prod
    status       env_status NOT NULL DEFAULT 'active',
    url          TEXT,                             -- 环境访问 URL
    branch       VARCHAR(200),                     -- Git 分支
    is_default   BOOLEAN NOT NULL DEFAULT false,
    config       JSONB NOT NULL DEFAULT '{}',      -- 环境配置 (构建命令/输出目录等)
    created_by   UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

CREATE INDEX idx_environments_project ON environments(project_id);
CREATE INDEX idx_environments_default ON environments(project_id, is_default) WHERE is_default = true;

-- ═══════════════════════════════════════════════════════════════
-- 2. environment_variables — 环境变量 (Environment 1:N EnvVar)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE environment_variables (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id  UUID NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
    key             VARCHAR(200) NOT NULL,
    value_encrypted TEXT,                          -- AES-256 加密值
    value_masked    VARCHAR(100),                  -- 脱敏显示
    is_secret       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(environment_id, key)
);

CREATE INDEX idx_envvars_environment ON environment_variables(environment_id);

-- ═══════════════════════════════════════════════════════════════
-- 3. project_folders — 文件夹/文件树 (Project 1:N Folder, 自引用树)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE project_folders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id   UUID REFERENCES project_folders(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    path        VARCHAR(1000) NOT NULL,            -- 完整路径 /src/components
    type        folder_type NOT NULL DEFAULT 'folder',
    file_type   VARCHAR(50),                       -- tsx/ts/css/json/md
    size        INTEGER DEFAULT 0,
    content     TEXT,                              -- 文件内容 (type=file 时)
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_hidden   BOOLEAN NOT NULL DEFAULT false,
    created_by  UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, path)
);

CREATE INDEX idx_folders_project ON project_folders(project_id);
CREATE INDEX idx_folders_parent ON project_folders(parent_id);
CREATE INDEX idx_folders_path ON project_folders(project_id, path);

-- ═══════════════════════════════════════════════════════════════
-- 4. deployments — 部署记录 (Environment 1:N Deployment)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE deployments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    environment_id  UUID NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
    platform        deploy_platform NOT NULL DEFAULT 'vercel',
    status          deploy_status NOT NULL DEFAULT 'queued',
    url             TEXT,
    commit_hash     VARCHAR(40),
    commit_message  VARCHAR(500),
    build_duration_ms INTEGER,
    env_vars        JSONB,                          -- 部署时环境变量快照
    deployed_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_deployments_project ON deployments(project_id, created_at DESC);
CREATE INDEX idx_deployments_env ON deployments(environment_id, created_at DESC);
CREATE INDEX idx_deployments_status ON deployments(status);

-- ═══════════════════════════════════════════════════════════════
-- 5. deploy_logs — 部署/构建日志 (Deployment 1:N Log)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE deploy_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id   UUID REFERENCES deployments(id) ON DELETE CASCADE,
    environment_id  UUID REFERENCES environments(id) ON DELETE CASCADE,
    level           log_level NOT NULL DEFAULT 'info',
    source          log_source NOT NULL DEFAULT 'build',
    message         TEXT NOT NULL,
    metadata        JSONB,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_deployment ON deploy_logs(deployment_id, timestamp);
CREATE INDEX idx_logs_env_time ON deploy_logs(environment_id, timestamp DESC);
CREATE INDEX idx_logs_level ON deploy_logs(level);

-- ═══════════════════════════════════════════════════════════════
-- 6. git_connections — Git 连接 (Project 1:1 GitConnection)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE git_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    provider        VARCHAR(50) NOT NULL DEFAULT 'github',  -- github/gitlab/bitbucket
    repo_id         VARCHAR(100),                   -- GitHub Repo ID
    repo_full_name  VARCHAR(255),                   -- owner/repo
    default_branch  VARCHAR(200) NOT NULL DEFAULT 'main',
    webhook_secret  TEXT,                           -- Webhook 密钥
    connected_by    UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_git_project ON git_connections(project_id);

-- ═══════════════════════════════════════════════════════════════
-- 7. git_syncs — Git 同步记录 (GitConnection 1:N Sync)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE git_syncs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    git_connection_id UUID NOT NULL REFERENCES git_connections(id) ON DELETE CASCADE,
    direction       git_sync_direction NOT NULL,
    branch          VARCHAR(200) NOT NULL,
    commit_hash     VARCHAR(40),
    commit_message  VARCHAR(500),
    status          git_sync_status NOT NULL DEFAULT 'pending',
    error           TEXT,
    synced_by       UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_gitsyncs_conn ON git_syncs(git_connection_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 8. terminal_sessions — 终端会话 (Environment 1:N Terminal)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE terminal_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id  UUID NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'active',  -- active/closed
    cwd             VARCHAR(500) DEFAULT '/',
    output          TEXT,                              -- 终端输出历史
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at       TIMESTAMPTZ
);

CREATE INDEX idx_terminal_env ON terminal_sessions(environment_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 9. database_connections — 数据库连接 (Environment 1:N DBConn)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE database_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id  UUID NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    engine          db_engine NOT NULL DEFAULT 'postgres',
    host            VARCHAR(255) NOT NULL,
    port            INTEGER NOT NULL DEFAULT 5432,
    database_name   VARCHAR(200) NOT NULL,
    username        VARCHAR(200) NOT NULL,
    password_encrypted TEXT,                        -- AES-256 加密
    connection_string_masked VARCHAR(200),           -- 脱敏
    status          db_conn_status NOT NULL DEFAULT 'disconnected',
    pool_size       INTEGER DEFAULT 10,
    ssl_mode        VARCHAR(20) DEFAULT 'prefer',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(environment_id, name)
);

CREATE INDEX idx_dbconn_env ON database_connections(environment_id);

-- ═══════════════════════════════════════════════════════════════
-- 10. storage_buckets — 存储桶 (Environment 1:N Storage)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE storage_buckets (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    environment_id      UUID NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    provider            storage_provider NOT NULL DEFAULT 's3',
    bucket_name         VARCHAR(200) NOT NULL,
    region              VARCHAR(50) DEFAULT 'us-east-1',
    access_key_encrypted TEXT,
    secret_key_encrypted TEXT,
    endpoint            TEXT,                        -- 自定义端点
    public_url_base     TEXT,                        -- 公开访问基础 URL
    total_size_bytes    BIGINT DEFAULT 0,
    file_count          INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(environment_id, name)
);

CREATE INDEX idx_storage_env ON storage_buckets(environment_id);

-- ═══════════════════════════════════════════════════════════════
-- 11. storage_objects — 存储对象 (StorageBucket 1:N Object)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE storage_objects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id       UUID NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
    key             VARCHAR(1000) NOT NULL,          -- 对象路径
    file_name       VARCHAR(500) NOT NULL,
    content_type    VARCHAR(100),
    size_bytes      BIGINT NOT NULL DEFAULT 0,
    url             TEXT,                             -- 访问 URL
    is_public       BOOLEAN NOT NULL DEFAULT false,
    metadata        JSONB,
    uploaded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bucket_id, key)
);

CREATE INDEX idx_storage_objects_bucket ON storage_objects(bucket_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 12. api_endpoints — API 端点 (Project 1:N API)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE api_endpoints (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    environment_id  UUID REFERENCES environments(id) ON DELETE CASCADE,  -- nullable = all envs
    method          api_method NOT NULL,
    path            VARCHAR(500) NOT NULL,            -- /api/users/:id
    description     TEXT,
    handler_code    TEXT,                              -- 处理函数代码
    auth_required   BOOLEAN NOT NULL DEFAULT true,
    rate_limit      INTEGER,                           -- 每分钟限制
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, method, path)
);

CREATE INDEX idx_api_project ON api_endpoints(project_id);
CREATE INDEX idx_api_env ON api_endpoints(environment_id);

-- ═══════════════════════════════════════════════════════════════
-- 13. auth_configs — 认证配置 (Project 1:N AuthConfig)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE auth_configs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    provider            auth_provider NOT NULL,
    is_enabled          BOOLEAN NOT NULL DEFAULT false,
    client_id           VARCHAR(500),
    client_secret_encrypted TEXT,                    -- AES-256 加密
    redirect_url        TEXT,
    scopes              JSONB DEFAULT '[]',           -- OAuth scopes
    config              JSONB DEFAULT '{}',           -- 额外配置
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, provider)
);

CREATE INDEX idx_auth_project ON auth_configs(project_id);

-- ═══════════════════════════════════════════════════════════════
-- 14. project_history — 项目历史 (Project 1:N History)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE project_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    environment_id  UUID REFERENCES environments(id) ON DELETE CASCADE,
    action          history_action NOT NULL,
    target_type     VARCHAR(50) NOT NULL,            -- file/deploy/env/config/database
    target_id       UUID,
    target_name     VARCHAR(500),
    description     TEXT,
    changes         JSONB,                            -- 变更详情 { before, after }
    user_id         UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_history_project ON project_history(project_id, created_at DESC);
CREATE INDEX idx_history_env ON project_history(environment_id, created_at DESC);
CREATE INDEX idx_history_action ON project_history(action);

-- ═══════════════════════════════════════════════════════════════
-- 15. subscriptions — 订阅 (Org 1:N Subscription) [扩展现有]
-- ═══════════════════════════════════════════════════════════════

-- (已在 06-数据库设计.md 中定义, 此处补充 project 维度)
-- subscriptions 表已存在, 额外添加 project 级别用量统计:

CREATE TABLE project_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    environment_id  UUID REFERENCES environments(id) ON DELETE CASCADE,
    resource        VARCHAR(50) NOT NULL,            -- ai_tokens/build_minutes/bandwidth/storage/deploys
    amount          BIGINT NOT NULL DEFAULT 0,
    unit            VARCHAR(20) NOT NULL,            -- tokens/minutes/mb/count
    period_start    TIMESTAMPTZ NOT NULL,
    period_end      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_project_period ON project_usage(project_id, period_start, period_end);
CREATE INDEX idx_usage_env ON project_usage(environment_id, period_start);

-- ═══════════════════════════════════════════════════════════════
-- ER 关系图 (文本表示)
-- ═══════════════════════════════════════════════════════════════
--
-- organizations ──1:N──→ projects
--                            │
--     ┌──────────────────────┼──────────────────────────────────────┐
--     │                      │                                      │
--     ▼                      ▼                                      ▼
-- environments          project_folders                  api_endpoints
--     │                  (自引用树)                          (method+path)
--     │
--     ├──1:N──→ environment_variables
--     ├──1:N──→ deployments ──1:N──→ deploy_logs
--     ├──1:N──→ terminal_sessions
--     ├──1:N──→ database_connections
--     ├──1:N──→ storage_buckets ──1:N──→ storage_objects
--     └──1:N──→ project_history
--
-- projects ──1:1──→ git_connections ──1:N──→ git_syncs
-- projects ──1:N──→ auth_configs
-- projects ──1:N──→ project_usage
-- projects ──1:N──→ project_history
