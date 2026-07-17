package com.novastudio.backend.role.domain.entity;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * 角色领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Role {

    private Long id;
    private Long workspaceId;
    private String name;
    private String code;
    private String description;
    private Boolean isSystem;
    private Set<Long> permissionIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Role create(Long workspaceId, String name, String code, String description) {
        return Role.builder()
                .workspaceId(workspaceId)
                .name(name)
                .code(code)
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

    public void assignPermissions(Set<Long> permissionIds) {
        this.permissionIds = permissionIds;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isSystemRole() {
        return Boolean.TRUE.equals(this.isSystem);
    }
}
