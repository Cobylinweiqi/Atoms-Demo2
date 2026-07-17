package com.novastudio.backend.role.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long id;
    private Long workspaceId;
    private String name;
    private String code;
    private String description;
    private Boolean isSystem;
    private Set<Long> permissionIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
