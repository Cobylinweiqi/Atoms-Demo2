package com.novastudio.backend.permission.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.permission.domain.entity.Permission;
import com.novastudio.backend.permission.domain.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PermissionDomainService {

    private final PermissionRepository permissionRepository;

    public void checkCodeAvailable(String code) {
        if (permissionRepository.existsByCode(code)) {
            throw new BusinessException(ErrorCode.PERMISSION_NOT_FOUND, "权限编码已存在");
        }
    }

    public Permission findById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PERMISSION_NOT_FOUND));
    }

    public void ensureNotSystemPermission(Permission permission) {
        if (permission.isSystemPermission()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "系统权限不可修改或删除");
        }
    }
}
