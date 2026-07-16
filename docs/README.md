# Nova Studio — AI Full Stack Builder

## 架构设计文档总索引

> **版本**: v1.0  
> **日期**: 2026-07-16  
> **状态**: 设计阶段  
> **定位**: AI Full Stack Builder — 通过对话生成全栈应用

Nova Studio 是一个 AI 驱动的全栈应用构建平台。用户通过自然语言对话即可生成从 Landing Page 到 SaaS、CRM、Dashboard、AI Agent、电商等全栈应用，并在同一工作区内完成可视化编辑、实时预览、主题定制、一键部署与团队协作。

---

## 文档目录

| 文档 | 内容 | 链接 |
|---|---|---|
| 01 | **产品需求文档 (PRD)** | [01-PRD.md](./01-PRD.md) |
| 02 | **功能模块** | [02-功能模块.md](./02-功能模块.md) |
| 03 | **页面列表** | [03-页面列表.md](./03-页面列表.md) |
| 04 | **系统架构** | [04-系统架构.md](./04-系统架构.md) |
| 05 | **目录结构** | [05-目录结构.md](./05-目录结构.md) |
| 06 | **数据库设计** | [06-数据库设计.md](./06-数据库设计.md) |
| 07 | **API 设计** | [07-API设计.md](./07-API设计.md) |
| 08 | **后端模块** | [08-后端模块.md](./08-后端模块.md) |
| 09 | **前端模块** | [09-前端模块.md](./09-前端模块.md) |
| 10 | **开发计划** | [10-开发计划.md](./10-开发计划.md) |
| 11 | **设计系统** | [11-设计系统.md](./11-设计系统.md) |

---

## 核心能力一览

```
① AI Chat         — 流式对话、多轮上下文、工具调用、多模型
② Project Workspace — 文件树、多标签页、终端、AI 助手抽屉
③ Visual Editor    — 组件树、画布拖拽、属性面板、Code↔Visual 同步
④ Theme Editor     — 颜色/排版/间距/圆角/阴影、预设主题、导出
⑤ Component Library — 预置组件、自定义组件、分类搜索
⑥ AI Agent        — 流程编排(ReactFlow)、触发方式、执行引擎
⑦ Multi Model     — OpenAI/Anthropic/Google/Groq/Ollama、BYOK
⑧ Deploy          — Vercel/Netlify/自托管、域名配置、构建日志
⑨ GitHub Sync     — 仓库关联、推送/拉取、分支管理、PR 创建
⑩ Team Workspace  — 组织管理、成员角色、邀请、权限、活动日志
```

## 技术栈概览

| 层级 | 技术 |
|---|---|
| Monorepo | Turborepo + pnpm |
| 前端 | Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui |
| 后端 | NestJS + Prisma 5 |
| 数据库 | PostgreSQL 16 + Redis 7 |
| AI | Vercel AI SDK 3 (OpenAI/Anthropic/Google/Groq/Ollama) |
| 实时 | Socket.io (WebSocket) |
| 部署 | Vercel + Docker |
| 测试 | Vitest + Playwright |

---

## 快速导航

- **产品定义** → [PRD](./01-PRD.md) | [功能模块](./02-功能模块.md)
- **设计规范** → [设计系统](./11-设计系统.md) | [页面列表](./03-页面列表.md) | [目录结构](./05-目录结构.md)
- **技术架构** → [系统架构](./04-系统架构.md) | [数据库](./06-数据库设计.md) | [API](./07-API设计.md)
- **工程实现** → [后端模块](./08-后端模块.md) | [前端模块](./09-前端模块.md)
- **项目计划** → [开发计划](./10-开发计划.md)
