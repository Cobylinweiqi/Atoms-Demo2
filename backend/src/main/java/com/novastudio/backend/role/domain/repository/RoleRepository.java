package com.novastudio.backend.role.domain.repository;

import com.novastudio.backend.role.domain.entity.Role;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository {

    Role save(Role role);

    Optional<Role> findById(Long id);

    Optional<Role> findByCodeAndWorkspaceId(String code, Long workspaceId);

    List<Role> findByWorkspaceId(Long workspaceId);

    boolean existsByCodeAndWorkspaceId(String code, Long workspaceId);

    void deleteById(Long id);

    Set<Long> findPermissionIdsByRoleId(Long roleId);

    void saveRolePermissions(Long roleId, Set<Long> permissionIds);

    List<Role> findByIds(Set<Long> ids);
}
