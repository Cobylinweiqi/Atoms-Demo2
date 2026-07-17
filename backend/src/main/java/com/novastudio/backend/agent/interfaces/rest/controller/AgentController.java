package com.novastudio.backend.agent.interfaces.rest.controller;

import com.novastudio.backend.agent.application.dto.AgentCommands.*;
import com.novastudio.backend.agent.application.dto.AgentDTO;
import com.novastudio.backend.agent.application.dto.AgentExecutionDTO;
import com.novastudio.backend.agent.application.service.AgentApplicationService;
import com.novastudio.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Agent", description = "Agent流程管理接口")
@RestController
@RequestMapping("/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentApplicationService agentApplicationService;

    @Operation(summary = "创建Agent")
    @PostMapping
    public ApiResponse<AgentDTO> create(@Valid @RequestBody CreateAgentCommand command) {
        return ApiResponse.created(agentApplicationService.create(command));
    }

    @Operation(summary = "更新Agent")
    @PatchMapping("/{id}")
    public ApiResponse<AgentDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateAgentCommand command) {
        return ApiResponse.success(agentApplicationService.update(id, command));
    }

    @Operation(summary = "获取Agent详情")
    @GetMapping("/{id}")
    public ApiResponse<AgentDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(agentApplicationService.findById(id));
    }

    @Operation(summary = "获取项目的Agent列表")
    @GetMapping
    public ApiResponse<List<AgentDTO>> findByProjectId(@RequestParam Long projectId) {
        return ApiResponse.success(agentApplicationService.findByProjectId(projectId));
    }

    @Operation(summary = "激活Agent")
    @PostMapping("/{id}/activate")
    public ApiResponse<AgentDTO> activate(@PathVariable Long id) {
        return ApiResponse.success(agentApplicationService.activate(id));
    }

    @Operation(summary = "暂停Agent")
    @PostMapping("/{id}/pause")
    public ApiResponse<AgentDTO> pause(@PathVariable Long id) {
        return ApiResponse.success(agentApplicationService.pause(id));
    }

    @Operation(summary = "删除Agent")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        agentApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "执行Agent")
    @PostMapping("/{id}/execute")
    public ApiResponse<AgentExecutionDTO> execute(@PathVariable Long id,
                                                   @RequestBody(required = false) ExecuteAgentCommand command) {
        return ApiResponse.created(agentApplicationService.execute(id, command != null ? command : new ExecuteAgentCommand()));
    }

    @Operation(summary = "获取执行历史")
    @GetMapping("/{id}/executions")
    public ApiResponse<List<AgentExecutionDTO>> findExecutions(
            @PathVariable Long id,
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(agentApplicationService.findExecutions(id, limit));
    }

    @Operation(summary = "获取执行详情")
    @GetMapping("/executions/{executionId}")
    public ApiResponse<AgentExecutionDTO> findExecutionById(@PathVariable Long executionId) {
        return ApiResponse.success(agentApplicationService.findExecutionById(executionId));
    }
}
