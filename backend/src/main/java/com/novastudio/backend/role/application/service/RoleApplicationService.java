package com.novastudio.backend.role.application.service;

import com.novastudio.backend.role.application.assembler.RoleAssembler;
import com.novastudio.backend.role.application.dto.CreateRoleCommand;
import com.novastudio.backend.role.application.dto.RoleDTO;
import com.novastudio.backend.role.application.dto.UpdateRoleCommand;
import com.novastudio.backend.role.domain.entity.Role;
import com.novastudio.backend.role.domain.repository.RoleRepository;
import com.novastudio.backend.role.domain.service.RoleDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleApplicationService {

    private final RoleRepository roleRepository;
    private final RoleDomainService roleDomainService;

    @Transactional
    public RoleDTO create(CreateRoleCommand command) {
        roleDomainService.checkCodeAvailable(command.getCode(), command.getWorkspaceId());

        Role role = Role.create(command.getWorkspaceId(), command.getName(),
                command.getCode(), command.getDescription());
        role = roleRepository.save(role);

        if (command.getPermissionIds() != null && !command.getPermissionIds().isEmpty()) {
            roleRepository.saveRolePermissions(role.getId(), command.getPermissionIds());
            role.assignPermissions(command.getPermissionIds());
        }

        log.info("Role created: id={}, code={}", role.getId(), role.getCode());
        return RoleAssembler.toDTO(role);
    }

    @Transactional
    public RoleDTO update(Long id, UpdateRoleCommand command) {
        Role role = roleDomainService.findById(id);
        roleDomainService.ensureNotSystemRole(role);

        role.update(command.getName(), command.getDescription());
        role = roleRepository.save(role);

        if (command.getPermissionIds() != null) {
            roleRepository.saveRolePermissions(id, command.getPermissionIds());
            role.assignPermissions(command.getPermissionIds());
        }

        return RoleAssembler.toDTO(role);
    }

    public RoleDTO findById(Long id) {
        Role role = roleDomainService.findByIdWithPermissions(id);
        return RoleAssembler.toDTO(role);
    }

    public List<RoleDTO> findByWorkspaceId(Long workspaceId) {
        List<Role> roles = roleRepository.findByWorkspaceId(workspaceId);
        return roles.stream().map(RoleAssembler::toDTO).toList();
    }

    @Transactional
    public void delete(Long id) {
        Role role = roleDomainService.findById(id);
        roleDomainService.ensureNotSystemRole(role);
        roleRepository.deleteById(id);
        log.info("Role deleted: id={}", id);
    }

    @Transactional
    public RoleDTO assignPermissions(Long id, java.util.Set<Long> permissionIds) {
        Role role = roleDomainService.findById(id);
        roleRepository.saveRolePermissions(id, permissionIds);
        role.assignPermissions(permissionIds);
        return RoleAssembler.toDTO(role);
    }
}
