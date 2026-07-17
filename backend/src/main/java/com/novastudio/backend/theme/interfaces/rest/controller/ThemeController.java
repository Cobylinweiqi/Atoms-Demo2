package com.novastudio.backend.theme.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.theme.application.dto.ThemeCommands.*;
import com.novastudio.backend.theme.application.dto.ThemeDTO;
import com.novastudio.backend.theme.application.service.ThemeApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "主题", description = "主题管理接口")
@RestController
@RequestMapping("/themes")
@RequiredArgsConstructor
public class ThemeController {

    private final ThemeApplicationService themeApplicationService;

    @Operation(summary = "创建主题")
    @PostMapping
    public ApiResponse<ThemeDTO> create(@Valid @RequestBody CreateThemeCommand command) {
        return ApiResponse.created(themeApplicationService.create(command));
    }

    @Operation(summary = "更新主题")
    @PatchMapping("/{id}")
    public ApiResponse<ThemeDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateThemeCommand command) {
        return ApiResponse.success(themeApplicationService.update(id, command));
    }

    @Operation(summary = "获取主题详情")
    @GetMapping("/{id}")
    public ApiResponse<ThemeDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(themeApplicationService.findById(id));
    }

    @Operation(summary = "获取项目的主题列表")
    @GetMapping
    public ApiResponse<List<ThemeDTO>> findByProjectId(@RequestParam Long projectId) {
        return ApiResponse.success(themeApplicationService.findByProjectId(projectId));
    }

    @Operation(summary = "获取项目当前激活的主题")
    @GetMapping("/active")
    public ApiResponse<ThemeDTO> findActiveByProjectId(@RequestParam Long projectId) {
        return ApiResponse.success(themeApplicationService.findActiveByProjectId(projectId));
    }

    @Operation(summary = "应用主题")
    @PostMapping("/{id}/apply")
    public ApiResponse<ThemeDTO> apply(@PathVariable Long id) {
        return ApiResponse.success(themeApplicationService.apply(id));
    }

    @Operation(summary = "删除主题")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        themeApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "导出主题")
    @PostMapping("/{id}/export")
    public ApiResponse<String> export(@PathVariable Long id, @Valid @RequestBody ExportThemeCommand command) {
        return ApiResponse.success(themeApplicationService.exportTheme(id, command));
    }
}
