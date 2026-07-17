package com.novastudio.backend.prompt.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.prompt.application.dto.CreatePromptCommand;
import com.novastudio.backend.prompt.application.dto.PromptDTO;
import com.novastudio.backend.prompt.application.dto.UpdatePromptCommand;
import com.novastudio.backend.prompt.application.service.PromptApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "提示词", description = "提示词管理接口")
@RestController
@RequestMapping("/prompts")
@RequiredArgsConstructor
public class PromptController {

    private final PromptApplicationService promptApplicationService;

    @Operation(summary = "创建提示词")
    @PostMapping
    public ApiResponse<PromptDTO> create(@Valid @RequestBody CreatePromptCommand command) {
        return ApiResponse.created(promptApplicationService.create(command));
    }

    @Operation(summary = "更新提示词")
    @PatchMapping("/{id}")
    public ApiResponse<PromptDTO> update(@PathVariable Long id, @Valid @RequestBody UpdatePromptCommand command) {
        return ApiResponse.success(promptApplicationService.update(id, command));
    }

    @Operation(summary = "获取提示词详情")
    @GetMapping("/{id}")
    public ApiResponse<PromptDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(promptApplicationService.findById(id));
    }

    @Operation(summary = "获取工作空间下的提示词列表")
    @GetMapping
    public ApiResponse<List<PromptDTO>> findByWorkspaceId(
            @RequestParam Long workspaceId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ApiResponse.success(promptApplicationService.findByWorkspaceId(workspaceId, category, search));
    }

    @Operation(summary = "获取公共提示词列表")
    @GetMapping("/public")
    public ApiResponse<List<PromptDTO>> findPublicPrompts(@RequestParam(required = false) String category) {
        return ApiResponse.success(promptApplicationService.findPublicPrompts(category));
    }

    @Operation(summary = "删除提示词")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        promptApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "切换公开/私有状态")
    @PostMapping("/{id}/toggle-public")
    public ApiResponse<PromptDTO> togglePublic(@PathVariable Long id) {
        return ApiResponse.success(promptApplicationService.togglePublic(id));
    }
}
