package com.novastudio.backend.conversation.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.common.response.PageResponse;
import com.novastudio.backend.conversation.application.dto.*;
import com.novastudio.backend.conversation.application.service.ConversationApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "对话", description = "对话与消息管理接口")
@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationApplicationService conversationApplicationService;

    @Operation(summary = "创建对话")
    @PostMapping
    public ApiResponse<ConversationDTO> create(@Valid @RequestBody CreateConversationCommand command) {
        return ApiResponse.created(conversationApplicationService.create(command));
    }

    @Operation(summary = "获取对话详情")
    @GetMapping("/{id}")
    public ApiResponse<ConversationDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(conversationApplicationService.findById(id));
    }

    @Operation(summary = "获取项目的对话列表")
    @GetMapping
    public ApiResponse<List<ConversationDTO>> findByProjectId(@RequestParam Long projectId) {
        return ApiResponse.success(conversationApplicationService.findByProjectId(projectId));
    }

    @Operation(summary = "更新对话标题")
    @PatchMapping("/{id}/title")
    public ApiResponse<ConversationDTO> updateTitle(@PathVariable Long id, @RequestParam String title) {
        return ApiResponse.success(conversationApplicationService.updateTitle(id, title));
    }

    @Operation(summary = "删除对话")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        conversationApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    @Operation(summary = "发送消息")
    @PostMapping("/{conversationId}/messages")
    public ApiResponse<MessageDTO> sendMessage(@PathVariable Long conversationId,
                                                @Valid @RequestBody SendMessageCommand command) {
        return ApiResponse.created(conversationApplicationService.sendMessage(conversationId, command));
    }

    @Operation(summary = "获取消息列表（分页）")
    @GetMapping("/{conversationId}/messages")
    public ApiResponse<PageResponse<MessageDTO>> findMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        return ApiResponse.success(conversationApplicationService.findMessages(conversationId, page, pageSize));
    }

    @Operation(summary = "获取最近消息")
    @GetMapping("/{conversationId}/messages/recent")
    public ApiResponse<List<MessageDTO>> findRecentMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(conversationApplicationService.findRecentMessages(conversationId, limit));
    }
}
