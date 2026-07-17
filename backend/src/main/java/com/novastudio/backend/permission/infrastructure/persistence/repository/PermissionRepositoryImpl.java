package com.novastudio.backend.permission.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.permission.domain.entity.Permission;
import com.novastudio.backend.permission.domain.repository.PermissionRepository;
import com.novastudio.backend.permission.infrastructure.persistence.converter.PermissionConverter;
import com.novastudio.backend.permission.infrastructure.persistence.entity.PermissionDO;
import com.novastudio.backend.permission.infrastructure.persistence.mapper.PermissionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
@RequiredArgsConstructor
public class PermissionRepositoryImpl implements PermissionRepository {

    private final PermissionMapper permissionMapper;

    @Override
    public Permission save(Permission permission) {
        PermissionDO permissionDO = PermissionConverter.toDO(permission);
        if (permissionDO.getId() == null) {
            permissionMapper.insert(permissionDO);
        } else {
            permissionMapper.updateById(permissionDO);
        }
        return PermissionConverter.toDomain(permissionDO);
    }

    @Override
    public Optional<Permission> findById(Long id) {
        PermissionDO permissionDO = permissionMapper.selectById(id);
        return Optional.ofNullable(PermissionConverter.toDomain(permissionDO));
    }

    @Override
    public Optional<Permission> findByCode(String code) {
        LambdaQueryWrapper<PermissionDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PermissionDO::getCode, code);
        return Optional.ofNullable(PermissionConverter.toDomain(permissionMapper.selectOne(wrapper)));
    }

    @Override
    public List<Permission> findAll() {
        LambdaQueryWrapper<PermissionDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(PermissionDO::getResource).orderByAsc(PermissionDO::getAction);
        return PermissionConverter.toDomainList(permissionMapper.selectList(wrapper));
    }

    @Override
    public List<Permission> findByResource(String resource) {
        LambdaQueryWrapper<PermissionDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PermissionDO::getResource, resource);
        return PermissionConverter.toDomainList(permissionMapper.selectList(wrapper));
    }

    @Override
    public boolean existsByCode(String code) {
        LambdaQueryWrapper<PermissionDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PermissionDO::getCode, code);
        return permissionMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void deleteById(Long id) {
        permissionMapper.deleteById(id);
    }

    @Override
    public List<Permission> findByIds(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        LambdaQueryWrapper<PermissionDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(PermissionDO::getId, ids);
        return PermissionConverter.toDomainList(permissionMapper.selectList(wrapper));
    }
}
