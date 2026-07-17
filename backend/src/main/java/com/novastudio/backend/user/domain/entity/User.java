package com.novastudio.backend.user.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 用户领域实体 (Domain Entity)
 * 纯领域对象，不包含任何框架注解
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    private Long id;
    private String email;
    private Boolean emailVerified;
    private String name;
    private String avatarUrl;
    private String passwordHash;
    private String githubId;
    private String googleId;
    private String preferredModel;
    private String locale;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;

    // 工厂方法 - 注册新用户
    public static User register(String email, String name, String passwordHash) {
        return User.builder()
                .email(email)
                .name(name)
                .passwordHash(passwordHash)
                .emailVerified(false)
                .preferredModel("gpt-4o")
                .locale("zh-CN")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // 工厂方法 - OAuth注册
    public static User registerWithOAuth(String email, String name, String avatarUrl,
                                         String oauthProvider, String oauthId) {
        UserBuilder builder = User.builder()
                .email(email)
                .name(name)
                .avatarUrl(avatarUrl)
                .emailVerified(true)
                .preferredModel("gpt-4o")
                .locale("zh-CN")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now());

        if ("github".equals(oauthProvider)) {
            builder.githubId(oauthId);
        } else if ("google".equals(oauthProvider)) {
            builder.googleId(oauthId);
        }

        return builder.build();
    }

    // 领域行为 - 更新资料
    public void updateProfile(String name, String avatarUrl, String preferredModel, String locale) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (avatarUrl != null) {
            this.avatarUrl = avatarUrl;
        }
        if (preferredModel != null && !preferredModel.isBlank()) {
            this.preferredModel = preferredModel;
        }
        if (locale != null && !locale.isBlank()) {
            this.locale = locale;
        }
        this.updatedAt = LocalDateTime.now();
    }

    // 领域行为 - 验证邮箱
    public void verifyEmail() {
        this.emailVerified = true;
        this.updatedAt = LocalDateTime.now();
    }

    // 领域行为 - 更新密码
    public void updatePassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
        this.updatedAt = LocalDateTime.now();
    }

    // 领域行为 - 记录登录
    public void recordLogin() {
        this.lastLoginAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 领域行为 - 是否为OAuth用户
    public boolean isOAuthUser() {
        return githubId != null || googleId != null;
    }
}
