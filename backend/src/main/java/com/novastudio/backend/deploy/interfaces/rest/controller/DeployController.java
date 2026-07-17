package com.novastudio.backend.deploy.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.deploy.application.dto.DeployCommands.*;
import com.novastudio.backend.deploy.application.dto.DeploymentDTO;
import com.novastudio.backend.deploy.application.service.DeployApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "部署", description = "部署管理接口")
@RestController
@RequestMapping("/deployments")
@RequiredArgsConstructor
public class DeployController {

    private final DeployApplicationService deployApplicationService;

    @Operation(summary = "创建部署")
    @PostMapping
    public ApiResponse<DeploymentDTO> create(@Valid @RequestBody CreateDeploymentCommand command) {
        return ApiResponse.created(deployApplicationService.create(command));
    }

    @Operation(summary = "获取部署详情")
    @GetMapping("/{id}")
    public ApiResponse<DeploymentDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(deployApplicationService.findById(id));
    }

    @Operation(summary = "获取项目的部署列表")
    @GetMapping
    public ApiResponse<List<DeploymentDTO>> findByProjectId(@RequestParam Long projectId) {
        return ApiResponse.success(deployApplicationService.findByProjectId(projectId));
    }

    @Operation(summary = "获取构建日志")
    @GetMapping("/{id}/logs")
    public ApiResponse<String> getBuildLog(@PathVariable Long id) {
        return ApiResponse.success(deployApplicationService.getBuildLog(id));
    }

    @Operation(summary = "取消部署")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> cancel(@PathVariable Long id) {
        deployApplicationService.cancel(id);
        return ApiResponse.success(null, "取消成功");
    }

    @Operation(summary = "提升到生产环境")
    @PostMapping("/{id}/promote")
    public ApiResponse<DeploymentDTO> promote(@PathVariable Long id) {
        return ApiResponse.success(deployApplicationService.promote(id));
    }
}
