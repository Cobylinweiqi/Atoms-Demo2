package com.novastudio.backend.project.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.project.application.dto.CreateProjectCommand;
import com.novastudio.backend.project.application.dto.ProjectDTO;
import com.novastudio.backend.project.application.dto.UpdateProjectCommand;
import com.novastudio.backend.project.application.service.ProjectApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "项目", description = "项目管理接口")
@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectApplicationService projectApplicationService;

    @Operation(summary = "创建项目")
    @PostMapping
    public ApiResponse<ProjectDTO> create(@Valid @RequestBody CreateProjectCommand command) {
        return ApiResponse.created(projectApplicationService.create(command));
    }

    @Operation(summary = "获取项目详情")
    @GetMapping("/{id}")
    public ApiResponse<ProjectDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(projectApplicationService.findById(id));
    }

    @Operation(summary = "获取工作空间下的项目列表")
    @GetMapping
    public ApiResponse<List<ProjectDTO>> findByWorkspaceId(
            @RequestParam Long workspaceId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ApiResponse.success(projectApplicationService.findByWorkspaceId(workspaceId, type, status, search));
    }

    @Operation(summary = "更新项目")
    @PatchMapping("/{id}")
    public ApiResponse<ProjectDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateProjectCommand command) {
        return ApiResponse.success(projectApplicationService.update(id, command));
    }

    @Operation(summary = "归档项目")
    @PostMapping("/{id}/archive")
    public ApiResponse<Void> archive(@PathVariable Long id) {
        projectApplicationService.archive(id);
        return ApiResponse.success(null, "归档成功");
    }

    @Operation(summary = "删除项目")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        projectApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "复制项目")
    @PostMapping("/{id}/duplicate")
    public ApiResponse<ProjectDTO> duplicate(@PathVariable Long id) {
        return ApiResponse.created(projectApplicationService.duplicate(id));
    }
}
