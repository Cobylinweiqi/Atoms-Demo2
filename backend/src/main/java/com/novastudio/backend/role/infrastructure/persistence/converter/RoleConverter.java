package com.novastudio.backend.role.infrastructure.persistence.converter;

import com.novastudio.backend.role.domain.entity.Role;
import com.novastudio.backend.role.infrastructure.persistence.entity.RoleDO;

import java.util.HashSet;
import java.util.List;

public class RoleConverter {

    private RoleConverter() {}

    public static Role toDomain(RoleDO roleDO) {
        if (roleDO == null) return null;
        return Role.builder()
                .id(roleDO.getId())
                .workspaceId(roleDO.getWorkspaceId())
                .name(roleDO.getName())
                .code(roleDO.getCode())
                .description(roleDO.getDescription())
                .isSystem(roleDO.getIsSystem())
                .permissionIds(new HashSet<>())
                .createdAt(roleDO.getCreatedAt())
                .updatedAt(roleDO.getUpdatedAt())
                .build();
    }

    public static RoleDO toDO(Role role) {
        if (role == null) return null;
        RoleDO roleDO = new RoleDO();
        roleDO.setId(role.getId());
        roleDO.setWorkspaceId(role.getWorkspaceId());
        roleDO.setName(role.getName());
        roleDO.setCode(role.getCode());
        roleDO.setDescription(role.getDescription());
        roleDO.setIsSystem(role.getIsSystem());
        roleDO.setCreatedAt(role.getCreatedAt());
        roleDO.setUpdatedAt(role.getUpdatedAt());
        return roleDO;
    }

    public static List<Role> toDomainList(List<RoleDO> roleDOs) {
        return roleDOs.stream().map(RoleConverter::toDomain).toList();
    }
}
