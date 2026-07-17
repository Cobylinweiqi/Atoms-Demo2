package com.novastudio.backend.workspace.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 工作空间成员领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WorkspaceMember {

    private Long id;
    private Long workspaceId;
    private Long userId;
    private String role;
    private String status;
    private String invitedEmail;
    private Long invitedBy;
    private LocalDateTime joinedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static WorkspaceMember create(Long workspaceId, Long userId, String role, Long invitedBy) {
        return WorkspaceMember.builder()
                .workspaceId(workspaceId)
                .userId(userId)
                .role(role)
                .status("active")
                .invitedBy(invitedBy)
                .joinedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static WorkspaceMember invite(Long workspaceId, String email, String role, Long invitedBy) {
        return WorkspaceMember.builder()
                .workspaceId(workspaceId)
                .invitedEmail(email)
                .role(role)
                .status("invited")
                .invitedBy(invitedBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void activate(Long userId) {
        this.userId = userId;
        this.status = "active";
        this.joinedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void changeRole(String newRole) {
        this.role = newRole;
        this.updatedAt = LocalDateTime.now();
    }

    public void suspend() {
        this.status = "suspended";
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isOwner() {
        return "owner".equals(this.role);
    }

    public boolean isAdmin() {
        return "owner".equals(this.role) || "admin".equals(this.role);
    }
}
