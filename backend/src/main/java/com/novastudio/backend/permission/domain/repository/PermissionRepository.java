package com.novastudio.backend.permission.domain.repository;

import com.novastudio.backend.permission.domain.entity.Permission;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface PermissionRepository {

    Permission save(Permission permission);

    Optional<Permission> findById(Long id);

    Optional<Permission> findByCode(String code);

    List<Permission> findAll();

    List<Permission> findByResource(String resource);

    boolean existsByCode(String code);

    void deleteById(Long id);

    List<Permission> findByIds(Set<Long> ids);
}
