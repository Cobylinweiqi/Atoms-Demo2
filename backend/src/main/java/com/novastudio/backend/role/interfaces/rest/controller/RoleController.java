package com.novastudio.backend.role.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.role.application.dto.CreateRoleCommand;
import com.novastudio.backend.role.application.dto.RoleDTO;
import com.novastudio.backend.role.application.dto.UpdateRoleCommand;
import com.novastudio.backend.role.application.service.RoleApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Tag(name = "角色", description = "角色管理接口")
@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleApplicationService roleApplicationService;

    @Operation(summary = "创建角色")
    @PostMapping
    public ApiResponse<RoleDTO> create(@Valid @RequestBody CreateRoleCommand command) {
        return ApiResponse.created(roleApplicationService.create(command));
    }

    @Operation(summary = "更新角色")
    @PatchMapping("/{id}")
    public ApiResponse<RoleDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateRoleCommand command) {
        return ApiResponse.success(roleApplicationService.update(id, command));
    }

    @Operation(summary = "获取角色详情")
    @GetMapping("/{id}")
    public ApiResponse<RoleDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(roleApplicationService.findById(id));
    }

    @Operation(summary = "获取工作空间下的角色列表")
    @GetMapping
    public ApiResponse<List<RoleDTO>> findByWorkspaceId(@RequestParam Long workspaceId) {
        return ApiResponse.success(roleApplicationService.findByWorkspaceId(workspaceId));
    }

    @Operation(summary = "删除角色")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        roleApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "为角色分配权限")
    @PostMapping("/{id}/permissions")
    public ApiResponse<RoleDTO> assignPermissions(@PathVariable Long id, @RequestBody Set<Long> permissionIds) {
        return ApiResponse.success(roleApplicationService.assignPermissions(id, permissionIds));
    }
}
