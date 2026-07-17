package com.novastudio.backend.workspace.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.workspace.application.dto.*;
import com.novastudio.backend.workspace.application.service.WorkspaceApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "工作空间", description = "工作空间管理接口")
@RestController
@RequestMapping("/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceApplicationService workspaceApplicationService;

    @Operation(summary = "创建工作空间")
    @PostMapping
    public ApiResponse<WorkspaceDTO> create(@Valid @RequestBody CreateWorkspaceCommand command) {
        return ApiResponse.created(workspaceApplicationService.create(command));
    }

    @Operation(summary = "获取工作空间详情")
    @GetMapping("/{id}")
    public ApiResponse<WorkspaceDTO> findById(@PathVariable Long id) {
        return ApiResponse.success(workspaceApplicationService.findById(id));
    }

    @Operation(summary = "获取当前用户的工作空间列表")
    @GetMapping("/mine")
    public ApiResponse<List<WorkspaceDTO>> findMyWorkspaces() {
        return ApiResponse.success(workspaceApplicationService.findMyWorkspaces());
    }

    @Operation(summary = "更新工作空间")
    @PatchMapping("/{id}")
    public ApiResponse<WorkspaceDTO> update(@PathVariable Long id, @Valid @RequestBody UpdateWorkspaceCommand command) {
        return ApiResponse.success(workspaceApplicationService.update(id, command));
    }

    @Operation(summary = "删除工作空间")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        workspaceApplicationService.delete(id);
        return ApiResponse.success(null, "删除成功");
    }

    // ===== Member Management =====

    @Operation(summary = "获取成员列表")
    @GetMapping("/{workspaceId}/members")
    public ApiResponse<List<WorkspaceMemberDTO>> findMembers(@PathVariable Long workspaceId) {
        return ApiResponse.success(workspaceApplicationService.findMembers(workspaceId));
    }

    @Operation(summary = "邀请成员")
    @PostMapping("/{workspaceId}/members/invite")
    public ApiResponse<WorkspaceMemberDTO> inviteMember(@PathVariable Long workspaceId,
                                                         @Valid @RequestBody InviteMemberCommand command) {
        return ApiResponse.created(workspaceApplicationService.inviteMember(workspaceId, command));
    }

    @Operation(summary = "修改成员角色")
    @PatchMapping("/{workspaceId}/members/{memberId}")
    public ApiResponse<WorkspaceMemberDTO> updateMemberRole(@PathVariable Long workspaceId,
                                                             @PathVariable Long memberId,
                                                             @RequestParam String role) {
        return ApiResponse.success(workspaceApplicationService.updateMemberRole(workspaceId, memberId, role));
    }

    @Operation(summary = "移除成员")
    @DeleteMapping("/{workspaceId}/members/{memberId}")
    public ApiResponse<Void> removeMember(@PathVariable Long workspaceId, @PathVariable Long memberId) {
        workspaceApplicationService.removeMember(workspaceId, memberId);
        return ApiResponse.success(null, "移除成功");
    }
}
