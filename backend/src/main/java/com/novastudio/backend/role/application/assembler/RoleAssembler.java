package com.novastudio.backend.role.application.assembler;

import com.novastudio.backend.role.application.dto.RoleDTO;
import com.novastudio.backend.role.domain.entity.Role;

public class RoleAssembler {

    private RoleAssembler() {}

    public static RoleDTO toDTO(Role role) {
        if (role == null) return null;
        return RoleDTO.builder()
                .id(role.getId())
                .workspaceId(role.getWorkspaceId())
                .name(role.getName())
                .code(role.getCode())
                .description(role.getDescription())
                .isSystem(role.getIsSystem())
                .permissionIds(role.getPermissionIds())
                .createdAt(role.getCreatedAt())
                .updatedAt(role.getUpdatedAt())
                .build();
    }
}
