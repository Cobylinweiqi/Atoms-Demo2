package com.novastudio.backend.workspace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMemberDTO {
    private Long id;
    private Long workspaceId;
    private Long userId;
    private String email;
    private String name;
    private String avatarUrl;
    private String role;
    private String status;
    private LocalDateTime joinedAt;
    private LocalDateTime createdAt;
}
