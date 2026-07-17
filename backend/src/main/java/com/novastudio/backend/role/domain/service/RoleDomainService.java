package com.novastudio.backend.role.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.role.domain.entity.Role;
import com.novastudio.backend.role.domain.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleDomainService {

    private final RoleRepository roleRepository;

    public void checkCodeAvailable(String code, Long workspaceId) {
        if (roleRepository.existsByCodeAndWorkspaceId(code, workspaceId)) {
            throw new BusinessException(ErrorCode.ROLE_NAME_EXISTS);
        }
    }

    public Role findById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));
    }

    public Role findByIdWithPermissions(Long id) {
        Role role = findById(id);
        Set<Long> permissionIds = roleRepository.findPermissionIdsByRoleId(id);
        role.assignPermissions(permissionIds);
        return role;
    }

    public void ensureNotSystemRole(Role role) {
        if (role.isSystemRole()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "系统角色不可修改或删除");
        }
    }
}
