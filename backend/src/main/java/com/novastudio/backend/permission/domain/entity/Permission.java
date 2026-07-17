package com.novastudio.backend.permission.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 权限领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Permission {

    private Long id;
    private String name;
    private String code;
    private String resource;
    private String action;
    private String description;
    private Boolean isSystem;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Permission create(String name, String code, String resource, String action, String description) {
        return Permission.builder()
                .name(name)
                .code(code)
                .resource(resource)
                .action(action)
                .description(description)
                .isSystem(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String description) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (description != null) {
            this.description = description;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isSystemPermission() {
        return Boolean.TRUE.equals(this.isSystem);
    }
}
