-- =====================================================
-- Nova Studio — 数据库初始化脚本
-- Database: MySQL 8.0+
-- Encoding: UTF-8
-- =====================================================

CREATE DATABASE IF NOT EXISTS nova_studio
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE nova_studio;

-- =====================================================
-- 1. users（用户表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
    `id`              BIGINT       NOT NULL COMMENT '主键',
    `email`           VARCHAR(255) NOT NULL COMMENT '邮箱',
    `email_verified`  TINYINT(1)   DEFAULT 0 COMMENT '邮箱验证',
    `name`            VARCHAR(100) NOT NULL COMMENT '用户名',
    `avatar_url`      TEXT         COMMENT '头像 URL',
    `password_hash`   VARCHAR(255) COMMENT '密码哈希',
    `github_id`       VARCHAR(255) COMMENT 'GitHub OAuth ID',
    `google_id`       VARCHAR(255) COMMENT 'Google OAuth ID',
    `preferred_model` VARCHAR(100) DEFAULT 'gpt-4o' COMMENT '偏好模型',
    `locale`          VARCHAR(10)  DEFAULT 'zh-CN' COMMENT '语言偏好',
    `last_login_at`   DATETIME     COMMENT '最后登录时间',
    `created_by`      BIGINT       DEFAULT 0 COMMENT '创建者',
    `updated_by`      BIGINT       DEFAULT 0 COMMENT '更新者',
    `created_at`      DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT(1)   DEFAULT 0 COMMENT '逻辑删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_email` (`email`, `deleted`),
    UNIQUE KEY `uk_users_github_id` (`github_id`),
    UNIQUE KEY `uk_users_google_id` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- =====================================================
-- 2. workspaces（工作空间表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `workspaces` (
    `id`         BIGINT       NOT NULL COMMENT '主键',
    `name`       VARCHAR(100) NOT NULL COMMENT '工作空间名',
    `slug`       VARCHAR(100) NOT NULL COMMENT 'URL slug',
    `owner_id`   BIGINT       NOT NULL COMMENT '所有者',
    `plan`       VARCHAR(20)  DEFAULT 'free' COMMENT 'free/pro/team/enterprise',
    `logo_url`   TEXT         COMMENT 'Logo',
    `created_by` BIGINT       DEFAULT 0,
    `updated_by` BIGINT       DEFAULT 0,
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`    TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_workspaces_slug` (`slug`, `deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工作空间表';

-- =====================================================
-- 3. workspace_members（工作空间成员表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `workspace_members` (
    `id`            BIGINT       NOT NULL,
    `workspace_id`  BIGINT       NOT NULL COMMENT '工作空间ID',
    `user_id`       BIGINT       COMMENT '用户ID',
    `role`          VARCHAR(20)  DEFAULT 'member' COMMENT 'owner/admin/member/viewer',
    `status`        VARCHAR(20)  DEFAULT 'invited' COMMENT 'active/invited/suspended',
    `invited_email` VARCHAR(255) COMMENT '邀请邮箱',
    `invited_by`    BIGINT       COMMENT '邀请人',
    `joined_at`     DATETIME     COMMENT '加入时间',
    `created_by`    BIGINT       DEFAULT 0,
    `updated_by`    BIGINT       DEFAULT 0,
    `created_at`    DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`       TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_ws_members_ws_user` (`workspace_id`, `user_id`, `deleted`),
    KEY `idx_ws_members_email` (`invited_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工作空间成员表';

-- =====================================================
-- 4. projects（项目表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `projects` (
    `id`           BIGINT       NOT NULL,
    `workspace_id` BIGINT       NOT NULL COMMENT '工作空间ID',
    `name`         VARCHAR(200) NOT NULL COMMENT '项目名',
    `slug`         VARCHAR(200) NOT NULL COMMENT 'URL slug',
    `description`  TEXT         COMMENT '描述',
    `type`         VARCHAR(50)  NOT NULL COMMENT 'website/saas/crm/dashboard/landing_page/ai_agent/blog/ecommerce/internal_tool',
    `framework`    VARCHAR(50)  DEFAULT 'nextjs' COMMENT '生成代码框架',
    `status`       VARCHAR(20)  DEFAULT 'active' COMMENT 'draft/active/archived',
    `created_by`   BIGINT       DEFAULT 0,
    `updated_by`   BIGINT       DEFAULT 0,
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`      TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_projects_ws_slug` (`workspace_id`, `slug`, `deleted`),
    KEY `idx_projects_workspace` (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';

-- =====================================================
-- 5. conversations（对话表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `conversations` (
    `id`          BIGINT       NOT NULL,
    `project_id`  BIGINT       NOT NULL COMMENT '项目ID',
    `user_id`     BIGINT       NOT NULL COMMENT '用户ID',
    `title`       VARCHAR(200) COMMENT '对话标题',
    `model`       VARCHAR(100) COMMENT '使用的模型',
    `created_by`  BIGINT       DEFAULT 0,
    `updated_by`  BIGINT       DEFAULT 0,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`     TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_conversations_project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话表';

-- =====================================================
-- 6. messages（消息表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `messages` (
    `id`                 BIGINT       NOT NULL,
    `conversation_id`    BIGINT       NOT NULL COMMENT '对话ID',
    `role`               VARCHAR(20)  NOT NULL COMMENT 'user/assistant/system/tool',
    `content`            MEDIUMTEXT   COMMENT '消息内容',
    `tool_calls`         JSON         COMMENT '工具调用数组',
    `tool_results`       JSON         COMMENT '工具执行结果',
    `model`              VARCHAR(100) COMMENT '生成模型',
    `prompt_tokens`      INT          COMMENT '输入Token',
    `completion_tokens`  INT          COMMENT '输出Token',
    `total_tokens`       INT          COMMENT '总Token',
    `cost_usd`           DECIMAL(10,6) COMMENT '成本(USD)',
    `created_at`         DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `deleted`            TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_messages_conv_created` (`conversation_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- =====================================================
-- 7. prompts（提示词表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `prompts` (
    `id`                    BIGINT       NOT NULL,
    `workspace_id`          BIGINT       NOT NULL COMMENT '工作空间ID',
    `name`                  VARCHAR(200) NOT NULL COMMENT '名称',
    `category`              VARCHAR(50)  COMMENT '分类',
    `system_prompt`         MEDIUMTEXT   NOT NULL COMMENT '系统提示词',
    `user_prompt_template`  MEDIUMTEXT   COMMENT '用户提示词模板',
    `description`           TEXT         COMMENT '描述',
    `variables`             JSON         COMMENT '变量定义',
    `is_public`             TINYINT(1)   DEFAULT 0 COMMENT '是否公开',
    `created_by`            BIGINT       DEFAULT 0,
    `updated_by`            BIGINT       DEFAULT 0,
    `created_at`            DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`            DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`               TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_prompts_workspace` (`workspace_id`),
    KEY `idx_prompts_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提示词表';

-- =====================================================
-- 8. agent_flows（Agent流程表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `agent_flows` (
    `id`             BIGINT       NOT NULL,
    `project_id`     BIGINT       NOT NULL COMMENT '项目ID',
    `name`           VARCHAR(200) NOT NULL COMMENT '名称',
    `description`    TEXT         COMMENT '描述',
    `nodes`          JSON         NOT NULL COMMENT '节点定义',
    `edges`          JSON         NOT NULL COMMENT '边定义',
    `trigger_type`   VARCHAR(20)  DEFAULT 'manual' COMMENT 'manual/webhook/schedule/event',
    `trigger_config` JSON         COMMENT '触发配置',
    `status`         VARCHAR(20)  DEFAULT 'draft' COMMENT 'draft/active/paused',
    `created_by`     BIGINT       DEFAULT 0,
    `updated_by`     BIGINT       DEFAULT 0,
    `created_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`        TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_agent_flows_project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Agent流程表';

-- =====================================================
-- 9. agent_executions（Agent执行表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `agent_executions` (
    `id`           BIGINT       NOT NULL,
    `agent_id`     BIGINT       NOT NULL COMMENT 'AgentID',
    `status`       VARCHAR(20)  DEFAULT 'pending' COMMENT 'pending/running/completed/failed/cancelled',
    `input`        JSON         COMMENT '输入参数',
    `output`       JSON         COMMENT '输出结果',
    `error`        TEXT         COMMENT '错误信息',
    `started_at`   DATETIME     COMMENT '开始时间',
    `completed_at` DATETIME     COMMENT '完成时间',
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `deleted`      TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_agent_exec_agent` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Agent执行表';

-- =====================================================
-- 10. theme_configs（主题配置表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `theme_configs` (
    `id`         BIGINT       NOT NULL,
    `project_id` BIGINT       NOT NULL COMMENT '项目ID',
    `name`       VARCHAR(100) NOT NULL COMMENT '主题名',
    `config`     JSON         NOT NULL COMMENT '完整主题配置',
    `is_active`  TINYINT(1)   DEFAULT 0 COMMENT '是否当前应用',
    `is_default` TINYINT(1)   DEFAULT 0 COMMENT '是否默认',
    `created_by` BIGINT       DEFAULT 0,
    `updated_by` BIGINT       DEFAULT 0,
    `created_at` DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`    TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_themes_project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='主题配置表';

-- =====================================================
-- 11. components（组件表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `components` (
    `id`           BIGINT       NOT NULL,
    `project_id`   BIGINT       NOT NULL COMMENT '项目ID',
    `name`         VARCHAR(200) NOT NULL COMMENT '组件名',
    `slug`         VARCHAR(200) NOT NULL COMMENT 'slug',
    `category`     VARCHAR(50)  COMMENT 'layout/form/display/navigation/data/media/overlay/ai',
    `description`  TEXT         COMMENT '描述',
    `source_code`  MEDIUMTEXT   NOT NULL COMMENT '源代码',
    `props_schema` JSON         COMMENT 'Props定义',
    `is_custom`    TINYINT(1)   DEFAULT 1 COMMENT '是否自定义',
    `is_public`    TINYINT(1)   DEFAULT 0 COMMENT '是否公开',
    `created_by`   BIGINT       DEFAULT 0,
    `updated_by`   BIGINT       DEFAULT 0,
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`      TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_components_proj_slug` (`project_id`, `slug`, `deleted`),
    KEY `idx_components_project_cat` (`project_id`, `category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='组件表';

-- =====================================================
-- 12. deployments（部署表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `deployments` (
    `id`           BIGINT       NOT NULL,
    `project_id`   BIGINT       NOT NULL COMMENT '项目ID',
    `platform`     VARCHAR(20)  NOT NULL COMMENT 'vercel/netlify/custom',
    `environment`  VARCHAR(20)  DEFAULT 'preview' COMMENT 'preview/production',
    `url`          TEXT         COMMENT '部署URL',
    `status`       VARCHAR(20)  DEFAULT 'queued' COMMENT 'queued/building/deploying/live/failed/cancelled',
    `build_log`    LONGTEXT     COMMENT '构建日志',
    `env_vars`     JSON         COMMENT '环境变量',
    `deployed_by`  BIGINT       COMMENT '部署者',
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `completed_at` DATETIME     COMMENT '完成时间',
    `deleted`      TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_deployments_project` (`project_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部署表';

-- =====================================================
-- 13. subscriptions（订阅表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `subscriptions` (
    `id`                    BIGINT       NOT NULL,
    `workspace_id`          BIGINT       NOT NULL COMMENT '工作空间ID',
    `plan`                  VARCHAR(20)  DEFAULT 'free' COMMENT 'free/pro/team/enterprise',
    `status`                VARCHAR(20)  DEFAULT 'active' COMMENT 'active/canceled/past_due/trialing',
    `stripe_customer_id`    VARCHAR(255) COMMENT 'Stripe客户ID',
    `stripe_subscription_id` VARCHAR(255) COMMENT 'Stripe订阅ID',
    `current_period_start`  DATETIME     COMMENT '当前周期开始',
    `current_period_end`    DATETIME     COMMENT '当前周期结束',
    `cancel_at_period_end`  TINYINT(1)   DEFAULT 0 COMMENT '到期取消',
    `created_by`            BIGINT       DEFAULT 0,
    `updated_by`            BIGINT       DEFAULT 0,
    `created_at`            DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`            DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`               TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_subscriptions_workspace` (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订阅表';

-- =====================================================
-- 14. usage_records（用量记录表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `usage_records` (
    `id`           BIGINT       NOT NULL,
    `workspace_id` BIGINT       NOT NULL COMMENT '工作空间ID',
    `user_id`      BIGINT       NOT NULL COMMENT '用户ID',
    `resource`     VARCHAR(30)  NOT NULL COMMENT 'ai_tokens/ai_messages/build_minutes/deployments',
    `amount`       INT          COMMENT '数量',
    `model`        VARCHAR(100) COMMENT '关联模型',
    `metadata`     JSON         COMMENT '元数据',
    `recorded_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `deleted`      TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `idx_usage_ws_resource` (`workspace_id`, `resource`, `recorded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用量记录表';

-- =====================================================
-- 15. roles（角色表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `roles` (
    `id`           BIGINT       NOT NULL,
    `workspace_id` BIGINT       NOT NULL COMMENT '工作空间ID',
    `name`         VARCHAR(100) NOT NULL COMMENT '角色名称',
    `code`         VARCHAR(100) NOT NULL COMMENT '角色编码',
    `description`  TEXT         COMMENT '描述',
    `is_system`    TINYINT(1)   DEFAULT 0 COMMENT '是否系统角色',
    `created_by`   BIGINT       DEFAULT 0,
    `updated_by`   BIGINT       DEFAULT 0,
    `created_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`      TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_roles_ws_code` (`workspace_id`, `code`, `deleted`),
    KEY `idx_roles_workspace` (`workspace_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- =====================================================
-- 16. permissions（权限表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `permissions` (
    `id`          BIGINT       NOT NULL,
    `name`        VARCHAR(100) NOT NULL COMMENT '权限名称',
    `code`        VARCHAR(100) NOT NULL COMMENT '权限编码',
    `resource`    VARCHAR(50)  NOT NULL COMMENT '资源',
    `action`      VARCHAR(50)  NOT NULL COMMENT '操作',
    `description` TEXT         COMMENT '描述',
    `is_system`   TINYINT(1)   DEFAULT 0 COMMENT '是否系统权限',
    `created_by`  BIGINT       DEFAULT 0,
    `updated_by`  BIGINT       DEFAULT 0,
    `created_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted`     TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_permissions_code` (`code`, `deleted`),
    KEY `idx_permissions_resource` (`resource`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限表';

-- =====================================================
-- 17. role_permissions（角色权限关联表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `role_permissions` (
    `id`            BIGINT   NOT NULL,
    `role_id`       BIGINT   NOT NULL COMMENT '角色ID',
    `permission_id` BIGINT   NOT NULL COMMENT '权限ID',
    `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_perms` (`role_id`, `permission_id`),
    KEY `idx_role_perms_perm` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色权限关联表';

-- =====================================================
-- 18. user_roles（用户角色关联表）
-- =====================================================
CREATE TABLE IF NOT EXISTS `user_roles` (
    `id`         BIGINT   NOT NULL,
    `user_id`    BIGINT   NOT NULL COMMENT '用户ID',
    `role_id`    BIGINT   NOT NULL COMMENT '角色ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_roles` (`user_id`, `role_id`),
    KEY `idx_user_roles_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- =====================================================
-- 初始化数据：系统权限
-- =====================================================
INSERT INTO `permissions` (`id`, `name`, `code`, `resource`, `action`, `description`, `is_system`, `created_at`)
VALUES
    (1, '创建项目', 'project:create', 'project', 'create', '创建项目权限', 1, NOW()),
    (2, '查看项目', 'project:read', 'project', 'read', '查看项目权限', 1, NOW()),
    (3, '更新项目', 'project:update', 'project', 'update', '更新项目权限', 1, NOW()),
    (4, '删除项目', 'project:delete', 'project', 'delete', '删除项目权限', 1, NOW()),
    (5, '部署项目', 'project:deploy', 'project', 'deploy', '部署项目权限', 1, NOW()),
    (10, '创建对话', 'conversation:create', 'conversation', 'create', '创建对话权限', 1, NOW()),
    (11, '查看对话', 'conversation:read', 'conversation', 'read', '查看对话权限', 1, NOW()),
    (12, '删除对话', 'conversation:delete', 'conversation', 'delete', '删除对话权限', 1, NOW()),
    (20, '创建组件', 'component:create', 'component', 'create', '创建组件权限', 1, NOW()),
    (21, '查看组件', 'component:read', 'component', 'read', '查看组件权限', 1, NOW()),
    (22, '更新组件', 'component:update', 'component', 'update', '更新组件权限', 1, NOW()),
    (23, '删除组件', 'component:delete', 'component', 'delete', '删除组件权限', 1, NOW()),
    (30, '创建主题', 'theme:create', 'theme', 'create', '创建主题权限', 1, NOW()),
    (31, '查看主题', 'theme:read', 'theme', 'read', '查看主题权限', 1, NOW()),
    (32, '更新主题', 'theme:update', 'theme', 'update', '更新主题权限', 1, NOW()),
    (33, '应用主题', 'theme:apply', 'theme', 'apply', '应用主题权限', 1, NOW()),
    (34, '删除主题', 'theme:delete', 'theme', 'delete', '删除主题权限', 1, NOW()),
    (40, '创建Agent', 'agent:create', 'agent', 'create', '创建Agent权限', 1, NOW()),
    (41, '查看Agent', 'agent:read', 'agent', 'read', '查看Agent权限', 1, NOW()),
    (42, '执行Agent', 'agent:execute', 'agent', 'execute', '执行Agent权限', 1, NOW()),
    (43, '更新Agent', 'agent:update', 'agent', 'update', '更新Agent权限', 1, NOW()),
    (44, '删除Agent', 'agent:delete', 'agent', 'delete', '删除Agent权限', 1, NOW()),
    (50, '管理成员', 'workspace:manage_members', 'workspace', 'manage_members', '管理成员权限', 1, NOW()),
    (51, '管理角色', 'workspace:manage_roles', 'workspace', 'manage_roles', '管理角色权限', 1, NOW()),
    (52, '管理账单', 'workspace:manage_billing', 'workspace', 'manage_billing', '管理账单权限', 1, NOW()),
    (53, '查看工作空间', 'workspace:read', 'workspace', 'read', '查看工作空间权限', 1, NOW()),
    (54, '更新工作空间', 'workspace:update', 'workspace', 'update', '更新工作空间权限', 1, NOW()),
    (55, '删除工作空间', 'workspace:delete', 'workspace', 'delete', '删除工作空间权限', 1, NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- =====================================================
-- 完成初始化
-- =====================================================
SELECT 'Database nova_studio initialized successfully!' AS message;
