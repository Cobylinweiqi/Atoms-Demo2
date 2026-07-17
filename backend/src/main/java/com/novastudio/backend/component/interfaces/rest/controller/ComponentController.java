package com.novastudio.backend.component.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.component.application.dto.ComponentCommands.*;
import com.novastudio.backend.component.application.dto.ComponentDTO;
import com.novastudio.backend.component.application.service.ComponentApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "组件", description = "组件管理接口")
@RestController
@RequestMapping("/components")
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentApplicationService componentApplicationService;

    @Operation(summary = "创建组件")
    @PostMapping
    public ApiResponse<ComponentDTO> create(@Valid @RequestBody CreateComponentCommand command) {
        return ApiResponse.created(componentApplicationService.create(command));
    }

    @Operation(summary = "更新组件")
    @PatchMapping("/{id}")
    public ApiResponse<ComponentDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateComponentCommand command) {
        return ApiResponse.success(componentApplicationService.update(id, command));
    }

    @Operation(summary = "获取组件详情")
    @GetMapping("/{id}")
    public ApiResponse<ComponentDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(componentApplicationService.findById(id));
    }

    @Operation(summary = "获取项目的组件列表")
    @GetMapping
    public ApiResponse<List<ComponentDTO>> findByProjectId(
            @RequestParam Long projectId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ApiResponse.success(componentApplicationService.findByProjectId(projectId, category, search));
    }

    @Operation(summary = "获取公共组件库")
    @GetMapping("/library")
    public ApiResponse<List<ComponentDTO>> findPublicLibrary(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ApiResponse.success(componentApplicationService.findPublicLibrary(category, search));
    }

    @Operation(summary = "删除组件")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        componentApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "切换公开/私有状态")
    @PostMapping("/{id}/toggle-public")
    public ApiResponse<ComponentDTO> togglePublic(@PathVariable Long id) {
        return ApiResponse.success(componentApplicationService.togglePublic(id));
    }
}
