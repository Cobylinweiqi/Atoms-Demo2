package com.novastudio.backend.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // Common Errors (40000-40999)
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未认证"),
    FORBIDDEN(403, "无权限"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    CONFLICT(409, "资源冲突"),
    INTERNAL_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务不可用"),

    // Auth Errors (41000-41999)
    AUTH_INVALID_CREDENTIALS(41001, "用户名或密码错误"),
    AUTH_TOKEN_EXPIRED(41002, "Token已过期"),
    AUTH_TOKEN_INVALID(41003, "Token无效"),
    AUTH_REFRESH_TOKEN_INVALID(41004, "RefreshToken无效"),
    AUTH_USER_DISABLED(41005, "用户已被禁用"),
    AUTH_EMAIL_ALREADY_EXISTS(41006, "邮箱已被注册"),
    AUTH_ACCOUNT_LOCKED(41007, "账号已被锁定"),

    // User Errors (42000-42999)
    USER_NOT_FOUND(42001, "用户不存在"),
    USER_EMAIL_EXISTS(42002, "邮箱已存在"),
    USER_INVALID_EMAIL(42003, "邮箱格式不正确"),
    USER_INVALID_PASSWORD(42004, "密码格式不正确"),

    // Workspace Errors (43000-43999)
    WORKSPACE_NOT_FOUND(43001, "工作空间不存在"),
    WORKSPACE_SLUG_EXISTS(43002, "工作空间标识已存在"),
    WORKSPACE_MEMBER_EXISTS(43003, "成员已存在"),
    WORKSPACE_MEMBER_NOT_FOUND(43004, "成员不存在"),
    WORKSPACE_INSUFFICIENT_PERMISSIONS(43005, "权限不足"),

    // Project Errors (44000-44999)
    PROJECT_NOT_FOUND(44001, "项目不存在"),
    PROJECT_SLUG_EXISTS(44002, "项目标识已存在"),
    PROJECT_ARCHIVED(44003, "项目已归档"),

    // Conversation Errors (45000-45999)
    CONVERSATION_NOT_FOUND(45001, "对话不存在"),
    MESSAGE_NOT_FOUND(45002, "消息不存在"),

    // Prompt Errors (46000-46999)
    PROMPT_NOT_FOUND(46001, "提示词不存在"),

    // Agent Errors (47000-47999)
    AGENT_NOT_FOUND(47001, "Agent不存在"),
    AGENT_EXECUTION_FAILED(47002, "Agent执行失败"),

    // Theme Errors (48000-48999)
    THEME_NOT_FOUND(48001, "主题不存在"),

    // Component Errors (49000-49999)
    COMPONENT_NOT_FOUND(49001, "组件不存在"),

    // Deploy Errors (50000-50999)
    DEPLOY_NOT_FOUND(50001, "部署不存在"),
    DEPLOY_FAILED(50002, "部署失败"),
    DEPLOY_IN_PROGRESS(50003, "部署正在进行中"),

    // Billing Errors (51000-51999)
    BILLING_NOT_FOUND(51001, "订阅不存在"),
    BILLING_QUOTA_EXCEEDED(51002, "配额已超限"),
    BILLING_PAYMENT_FAILED(51003, "支付失败"),

    // Role & Permission Errors (52000-52999)
    ROLE_NOT_FOUND(52001, "角色不存在"),
    ROLE_NAME_EXISTS(52002, "角色名称已存在"),
    PERMISSION_NOT_FOUND(52003, "权限不存在");

    private final int code;
    private final String message;
}
