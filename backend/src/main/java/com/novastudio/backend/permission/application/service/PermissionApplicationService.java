package com.novastudio.backend.permission.application.service;

import com.novastudio.backend.permission.application.assembler.PermissionAssembler;
import com.novastudio.backend.permission.application.dto.CreatePermissionCommand;
import com.novastudio.backend.permission.application.dto.PermissionDTO;
import com.novastudio.backend.permission.application.dto.UpdatePermissionCommand;
import com.novastudio.backend.permission.domain.entity.Permission;
import com.novastudio.backend.permission.domain.repository.PermissionRepository;
import com.novastudio.backend.permission.domain.service.PermissionDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PermissionApplicationService {

    private final PermissionRepository permissionRepository;
    private final PermissionDomainService permissionDomainService;

    @Transactional
    public PermissionDTO create(CreatePermissionCommand command) {
        permissionDomainService.checkCodeAvailable(command.getCode());

        Permission permission = Permission.create(command.getName(), command.getCode(),
                command.getResource(), command.getAction(), command.getDescription());
        permission = permissionRepository.save(permission);

        log.info("Permission created: id={}, code={}", permission.getId(), permission.getCode());
        return PermissionAssembler.toDTO(permission);
    }

    @Transactional
    public PermissionDTO update(Long id, UpdatePermissionCommand command) {
        Permission permission = permissionDomainService.findById(id);
        permissionDomainService.ensureNotSystemPermission(permission);

        permission.update(command.getName(), command.getDescription());
        permission = permissionRepository.save(permission);

        return PermissionAssembler.toDTO(permission);
    }

    public PermissionDTO findById(Long id) {
        return PermissionAssembler.toDTO(permissionDomainService.findById(id));
    }

    public List<PermissionDTO> findAll() {
        return permissionRepository.findAll().stream()
                .map(PermissionAssembler::toDTO)
                .toList();
    }

    public List<PermissionDTO> findByResource(String resource) {
        return permissionRepository.findByResource(resource).stream()
                .map(PermissionAssembler::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        Permission permission = permissionDomainService.findById(id);
        permissionDomainService.ensureNotSystemPermission(permission);
        permissionRepository.deleteById(id);
        log.info("Permission deleted: id={}", id);
    }
}
