package com.novastudio.backend.permission.infrastructure.persistence.converter;

import com.novastudio.backend.permission.domain.entity.Permission;
import com.novastudio.backend.permission.infrastructure.persistence.entity.PermissionDO;

import java.util.List;

public class PermissionConverter {

    private PermissionConverter() {}

    public static Permission toDomain(PermissionDO permissionDO) {
        if (permissionDO == null) return null;
        return Permission.builder()
                .id(permissionDO.getId())
                .name(permissionDO.getName())
                .code(permissionDO.getCode())
                .resource(permissionDO.getResource())
                .action(permissionDO.getAction())
                .description(permissionDO.getDescription())
                .isSystem(permissionDO.getIsSystem())
                .createdAt(permissionDO.getCreatedAt())
                .updatedAt(permissionDO.getUpdatedAt())
                .build();
    }

    public static PermissionDO toDO(Permission permission) {
        if (permission == null) return null;
        PermissionDO permissionDO = new PermissionDO();
        permissionDO.setId(permission.getId());
        permissionDO.setName(permission.getName());
        permissionDO.setCode(permission.getCode());
        permissionDO.setResource(permission.getResource());
        permissionDO.setAction(permission.getAction());
        permissionDO.setDescription(permission.getDescription());
        permissionDO.setIsSystem(permission.getIsSystem());
        permissionDO.setCreatedAt(permission.getCreatedAt());
        permissionDO.setUpdatedAt(permission.getUpdatedAt());
        return permissionDO;
    }

    public static List<Permission> toDomainList(List<PermissionDO> permissionDOs) {
        return permissionDOs.stream().map(PermissionConverter::toDomain).toList();
    }
}
