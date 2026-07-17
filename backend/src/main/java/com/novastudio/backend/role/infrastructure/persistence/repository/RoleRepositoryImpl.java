package com.novastudio.backend.role.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.role.domain.entity.Role;
import com.novastudio.backend.role.domain.repository.RoleRepository;
import com.novastudio.backend.role.infrastructure.persistence.converter.RoleConverter;
import com.novastudio.backend.role.infrastructure.persistence.entity.RoleDO;
import com.novastudio.backend.role.infrastructure.persistence.entity.RolePermissionDO;
import com.novastudio.backend.role.infrastructure.persistence.mapper.RoleMapper;
import com.novastudio.backend.role.infrastructure.persistence.mapper.RolePermissionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RoleRepositoryImpl implements RoleRepository {

    private final RoleMapper roleMapper;
    private final RolePermissionMapper rolePermissionMapper;

    @Override
    @Transactional
    public Role save(Role role) {
        RoleDO roleDO = RoleConverter.toDO(role);
        if (roleDO.getId() == null) {
            roleMapper.insert(roleDO);
        } else {
            roleMapper.updateById(roleDO);
        }
        return RoleConverter.toDomain(roleDO);
    }

    @Override
    public Optional<Role> findById(Long id) {
        RoleDO roleDO = roleMapper.selectById(id);
        return Optional.ofNullable(RoleConverter.toDomain(roleDO));
    }

    @Override
    public Optional<Role> findByCodeAndWorkspaceId(String code, Long workspaceId) {
        LambdaQueryWrapper<RoleDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RoleDO::getCode, code)
               .eq(RoleDO::getWorkspaceId, workspaceId);
        RoleDO roleDO = roleMapper.selectOne(wrapper);
        return Optional.ofNullable(RoleConverter.toDomain(roleDO));
    }

    @Override
    public List<Role> findByWorkspaceId(Long workspaceId) {
        LambdaQueryWrapper<RoleDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RoleDO::getWorkspaceId, workspaceId)
               .orderByDesc(RoleDO::getCreatedAt);
        return RoleConverter.toDomainList(roleMapper.selectList(wrapper));
    }

    @Override
    public boolean existsByCodeAndWorkspaceId(String code, Long workspaceId) {
        LambdaQueryWrapper<RoleDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RoleDO::getCode, code)
               .eq(RoleDO::getWorkspaceId, workspaceId);
        return roleMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void deleteById(Long id) {
        roleMapper.deleteById(id);
    }

    @Override
    public Set<Long> findPermissionIdsByRoleId(Long roleId) {
        List<Long> permissionIds = rolePermissionMapper.selectPermissionIdsByRoleId(roleId);
        return new HashSet<>(permissionIds);
    }

    @Override
    @Transactional
    public void saveRolePermissions(Long roleId, Set<Long> permissionIds) {
        // 先删除旧的关联
        LambdaQueryWrapper<RolePermissionDO> deleteWrapper = new LambdaQueryWrapper<>();
        deleteWrapper.eq(RolePermissionDO::getRoleId, roleId);
        rolePermissionMapper.delete(deleteWrapper);

        // 插入新的关联
        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<RolePermissionDO> rolePermissions = permissionIds.stream().map(pid -> {
                RolePermissionDO rp = new RolePermissionDO();
                rp.setRoleId(roleId);
                rp.setPermissionId(pid);
                rp.setCreatedAt(LocalDateTime.now());
                return rp;
            }).collect(Collectors.toList());
            rolePermissionMapper.batchInsert(rolePermissions);
        }
    }

    @Override
    public List<Role> findByIds(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        LambdaQueryWrapper<RoleDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(RoleDO::getId, ids);
        return RoleConverter.toDomainList(roleMapper.selectList(wrapper));
    }
}
