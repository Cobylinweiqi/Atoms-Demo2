package com.novastudio.backend.permission.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.permission.application.dto.CreatePermissionCommand;
import com.novastudio.backend.permission.application.dto.PermissionDTO;
import com.novastudio.backend.permission.application.dto.UpdatePermissionCommand;
import com.novastudio.backend.permission.application.service.PermissionApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "权限", description = "权限管理接口")
@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionApplicationService permissionApplicationService;

    @Operation(summary = "创建权限")
    @PostMapping
    public ApiResponse<PermissionDTO> create(@Valid @RequestBody CreatePermissionCommand command) {
        return ApiResponse.created(permissionApplicationService.create(command));
    }

    @Operation(summary = "更新权限")
    @PatchMapping("/{id}")
    public ApiResponse<PermissionDTO> update(@PathVariable Long id, @Valid @RequestBody UpdatePermissionCommand command) {
        return ApiResponse.success(permissionApplicationService.update(id, command));
    }

    @Operation(summary = "获取权限详情")
    @GetMapping("/{id}")
    public ApiResponse<PermissionDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(permissionApplicationService.findById(id));
    }

    @Operation(summary = "获取所有权限列表")
    @GetMapping
    public ApiResponse<List<PermissionDTO>> findAll(@RequestParam(required = false) String resource) {
        if (resource != null) {
            return ApiResponse.success(permissionApplicationService.findByResource(resource));
        }
        return ApiResponse.success(permissionApplicationService.findAll());
    }

    @Operation(summary = "删除权限")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        permissionApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }
}
