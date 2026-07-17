package com.novastudio.backend.permission.application.assembler;

import com.novastudio.backend.permission.application.dto.PermissionDTO;
import com.novastudio.backend.permission.domain.entity.Permission;

public class PermissionAssembler {

    private PermissionAssembler() {}

    public static PermissionDTO toDTO(Permission permission) {
        if (permission == null) return null;
        return PermissionDTO.builder()
                .id(permission.getId())
                .name(permission.getName())
                .code(permission.getCode())
                .resource(permission.getResource())
                .action(permission.getAction())
                .description(permission.getDescription())
                .isSystem(permission.getIsSystem())
                .createdAt(permission.getCreatedAt())
                .build();
    }
}
