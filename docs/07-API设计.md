# 07. API 设计

> **Nova Studio — AI Full Stack Builder**  
> 版本: v1.0 | 日期: 2026-07-16  
> 基础 URL: `https://api.nova-studio.app/v1`

---

## 7.1 REST API

### 认证 (Auth)

| 方法 | 路径 | 说明 | 请求体 | 响应 |
|---|---|---|---|---|
| POST | `/api/auth/register` | 注册 | `{email, password, name}` | `{user, accessToken, refreshToken}` |
| POST | `/api/auth/login` | 登录 | `{email, password}` | `{user, accessToken, refreshToken}` |
| POST | `/api/auth/logout` | 登出 | — | `{success}` |
| POST | `/api/auth/refresh` | 刷新 Token | `{refreshToken}` | `{accessToken}` |
| GET | `/api/auth/me` | 当前用户 | — | `{user}` |
| POST | `/api/auth/oauth/github` | GitHub OAuth | `{code}` | `{user, accessToken, refreshToken}` |
| POST | `/api/auth/oauth/google` | Google OAuth | `{code}` | `{user, accessToken, refreshToken}` |

### 组织 (Organizations)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/organizations` | 获取用户所属组织列表 |
| POST | `/api/organizations` | 创建组织 |
| GET | `/api/organizations/:orgId` | 获取组织详情 |
| PATCH | `/api/organizations/:orgId` | 更新组织 |
| DELETE | `/api/organizations/:orgId` | 删除组织 |
| GET | `/api/organizations/:orgId/members` | 成员列表 |
| POST | `/api/organizations/:orgId/invites` | 发送邀请 |
| PATCH | `/api/organizations/:orgId/members/:userId` | 更改成员角色 |
| DELETE | `/api/organizations/:orgId/members/:userId` | 移除成员 |
| GET | `/api/organizations/:orgId/activity` | 活动日志 |
| GET | `/api/organizations/:orgId/usage` | 用量统计 |

### 项目 (Projects)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/organizations/:orgId/projects` | 项目列表（支持 `?type=&status=&search=`） |
| POST | `/api/organizations/:orgId/projects` | 创建项目 |
| GET | `/api/projects/:projectId` | 项目详情 |
| PATCH | `/api/projects/:projectId` | 更新项目 |
| DELETE | `/api/projects/:projectId` | 删除项目 |
| POST | `/api/projects/:projectId/duplicate` | 复制项目 |
| GET | `/api/projects/:projectId/stats` | 项目统计 |

### 文件 (Files)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:projectId/files` | 文件树 |
| GET | `/api/projects/:projectId/files?path=` | 读取文件内容 |
| POST | `/api/projects/:projectId/files` | 创建文件 `{path, content}` |
| PATCH | `/api/projects/:projectId/files/:fileId` | 更新文件 |
| DELETE | `/api/projects/:projectId/files/:fileId` | 删除文件 |
| POST | `/api/projects/:projectId/files/batch` | 批量操作 |
| GET | `/api/projects/:projectId/files/:fileId/versions` | 文件版本历史 |
| POST | `/api/projects/:projectId/files/:fileId/revert` | 回退到指定版本 |

### 对话与消息 (Conversations & Messages)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:projectId/conversations` | 对话列表 |
| POST | `/api/projects/:projectId/conversations` | 创建对话 |
| GET | `/api/conversations/:conversationId` | 对话详情 |
| DELETE | `/api/conversations/:conversationId` | 删除对话 |
| GET | `/api/conversations/:conversationId/messages` | 消息列表（分页） |
| POST | `/api/conversations/:conversationId/messages` | 发送消息（**SSE 流式**） |
| POST | `/api/conversations/:conversationId/stop` | 停止生成 |
| POST | `/api/conversations/:conversationId/regenerate` | 重新生成 |

#### 消息发送请求体

```json
{
  "content": "帮我创建一个用户登录页面",
  "model": "claude-3-5-sonnet",
  "attachments": [],
  "context": {
    "activeFile": "src/app/page.tsx",
    "selection": null
  }
}
```

#### SSE 流式响应

```
event: message_chunk
data: {"delta": {"content": "好的"}}

event: message_chunk
data: {"delta": {"content": "，我来"}}

event: tool_call
data: {"tool": "create_file", "args": {"path": "src/app/login/page.tsx", "content": "..."}}

event: tool_result
data: {"tool": "create_file", "result": {"success": true, "path": "src/app/login/page.tsx"}}

event: message_chunk
data: {"delta": {"content": "已创建登录页面..."}}

event: message_complete
data: {"messageId": "...", "tokens": {"prompt": 1200, "completion": 350}}
```

### AI 模型 (AI Models)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/ai/models` | 可用模型列表 |
| GET | `/api/ai/models/:modelId` | 模型详情 |
| POST | `/api/ai/models/:modelId/test` | 测试模型连接 |
| GET | `/api/users/me/api-keys` | 获取 API Key 列表 |
| POST | `/api/users/me/api-keys` | 添加 API Key |
| DELETE | `/api/users/me/api-keys/:keyId` | 删除 API Key |

### 组件 (Components)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:projectId/components` | 组件列表（支持 `?category=&search=`） |
| POST | `/api/projects/:projectId/components` | 创建组件 |
| GET | `/api/projects/:projectId/components/:componentId` | 组件详情 |
| PATCH | `/api/projects/:projectId/components/:componentId` | 更新组件 |
| DELETE | `/api/projects/:projectId/components/:componentId` | 删除组件 |
| GET | `/api/components/library` | 全局公共组件库 |

### 主题 (Themes)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:projectId/themes` | 主题列表 |
| POST | `/api/projects/:projectId/themes` | 创建主题 |
| GET | `/api/projects/:projectId/themes/:themeId` | 主题详情 |
| PATCH | `/api/projects/:projectId/themes/:themeId` | 更新主题 |
| DELETE | `/api/projects/:projectId/themes/:themeId` | 删除主题 |
| POST | `/api/projects/:projectId/themes/:themeId/apply` | 应用主题 |
| GET | `/api/themes/presets` | 预设主题库 |
| POST | `/api/projects/:projectId/themes/export` | 导出为 CSS 变量/Tailwind 配置 |

### Agent 流程 (Agent Flows)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:projectId/agents` | Agent 列表 |
| POST | `/api/projects/:projectId/agents` | 创建 Agent |
| GET | `/api/projects/:projectId/agents/:agentId` | Agent 详情 |
| PATCH | `/api/projects/:projectId/agents/:agentId` | 更新 Agent |
| DELETE | `/api/projects/:projectId/agents/:agentId` | 删除 Agent |
| POST | `/api/projects/:projectId/agents/:agentId/execute` | 执行 Agent |
| GET | `/api/projects/:projectId/agents/:agentId/executions` | 执行历史 |
| GET | `/api/agents/:agentId/executions/:executionId` | 执行详情 |

### 部署 (Deployments)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/:projectId/deployments` | 部署历史 |
| POST | `/api/projects/:projectId/deployments` | 创建部署 |
| GET | `/api/projects/:projectId/deployments/:deploymentId` | 部署详情 |
| GET | `/api/projects/:projectId/deployments/:deploymentId/logs` | 构建日志 |
| DELETE | `/api/projects/:projectId/deployments/:deploymentId` | 取消部署 |
| POST | `/api/projects/:projectId/deployments/:deploymentId/promote` | 预览→生产 |

### GitHub 同步 (GitHub Sync)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/organizations/:orgId/github/repos` | 可关联仓库列表 |
| POST | `/api/projects/:projectId/github/connect` | 关联仓库 |
| DELETE | `/api/projects/:projectId/github/disconnect` | 取消关联 |
| POST | `/api/projects/:projectId/github/push` | 推送到 GitHub |
| POST | `/api/projects/:projectId/github/pull` | 从 GitHub 拉取 |
| GET | `/api/projects/:projectId/github/branches` | 分支列表 |
| GET | `/api/projects/:projectId/github/commits` | 提交历史 |
| POST | `/api/projects/:projectId/github/pr` | 创建 PR |

### 预览 (Preview)

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/projects/:projectId/preview/start` | 启动沙箱预览 |
| GET | `/api/projects/:projectId/preview/status` | 预览状态 |
| POST | `/api/projects/:projectId/preview/stop` | 停止预览 |
| POST | `/api/projects/:projectId/preview/refresh` | 刷新预览 |

### 账单 (Billing)

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/organizations/:orgId/billing` | 账单概览 |
| POST | `/api/organizations/:orgId/billing/subscribe` | 创建订阅 |
| POST | `/api/organizations/:orgId/billing/cancel` | 取消订阅 |
| GET | `/api/organizations/:orgId/billing/invoices` | 发票列表 |
| POST | `/api/webhooks/stripe` | Stripe Webhook |

---

## 7.2 WebSocket 事件

### 客户端 → 服务端

| 事件 | 载荷 | 说明 |
|---|---|---|
| `chat:send` | `{conversationId, content, model}` | 发送消息（WS 通道） |
| `chat:stop` | `{conversationId}` | 停止生成 |
| `file:subscribe` | `{projectId}` | 订阅文件变更事件 |
| `preview:subscribe` | `{projectId}` | 订阅预览状态 |
| `cursor:move` | `{projectId, file, position}` | 光标位置（协作） |
| `presence:join` | `{projectId}` | 加入项目（在线状态） |
| `presence:leave` | `{projectId}` | 离开项目 |

### 服务端 → 客户端

| 事件 | 载荷 | 说明 |
|---|---|---|
| `chat:chunk` | `{delta}` | 流式文本块 |
| `chat:tool_call` | `{tool, args}` | AI 工具调用 |
| `chat:tool_result` | `{tool, result}` | 工具执行结果 |
| `chat:complete` | `{messageId, tokens}` | 消息完成 |
| `chat:error` | `{error}` | 错误 |
| `file:created` | `{path, content}` | 文件创建 |
| `file:updated` | `{path, content}` | 文件更新 |
| `file:deleted` | `{path}` | 文件删除 |
| `preview:ready` | `{url}` | 预览就绪 |
| `preview:error` | `{error}` | 预览错误 |
| `deploy:progress` | `{stage, message}` | 部署进度 |
| `deploy:complete` | `{url}` | 部署完成 |
| `deploy:failed` | `{error}` | 部署失败 |
| `presence:update` | `{users[]}` | 在线用户更新 |
| `cursor:update` | `{userId, file, position}` | 光标更新 |

---

## 7.3 API 通用规范

### 认证

```
Authorization: Bearer <accessToken>
```

### 分页

```
GET /api/...?page=1&pageSize=20

响应:
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 错误格式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}
```

### HTTP 状态码

| 状态码 | 说明 |
|---|---|
| 200 | 成功 |
| 201 | 创建 |
| 400 | 请求错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 不存在 |
| 429 | 限流 |
| 500 | 服务器错误 |

### 限流

| 端点类型 | Free | Pro |
|---|---|---|
| AI 端点 | 20 req/min | 100 req/min |
| 普通 API | 100 req/min | 500 req/min |

响应头: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

[← 上一章: 数据库设计](./06-数据库设计.md) | [返回索引](./README.md) | [下一章: 后端模块 →](./08-后端模块.md)
