package com.novastudio.backend.workspace.application.assembler;

import com.novastudio.backend.workspace.application.dto.WorkspaceDTO;
import com.novastudio.backend.workspace.application.dto.WorkspaceMemberDTO;
import com.novastudio.backend.workspace.domain.entity.Workspace;
import com.novastudio.backend.workspace.domain.entity.WorkspaceMember;

public class WorkspaceAssembler {

    private WorkspaceAssembler() {}

    public static WorkspaceDTO toDTO(Workspace workspace) {
        if (workspace == null) return null;
        return WorkspaceDTO.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .ownerId(workspace.getOwnerId())
                .plan(workspace.getPlan())
                .logoUrl(workspace.getLogoUrl())
                .createdAt(workspace.getCreatedAt())
                .build();
    }

    public static WorkspaceDTO toDTO(Workspace workspace, String currentUserRole) {
        WorkspaceDTO dto = toDTO(workspace);
        if (dto != null) {
            dto.setCurrentUserRole(currentUserRole);
        }
        return dto;
    }

    public static WorkspaceMemberDTO toMemberDTO(WorkspaceMember member) {
        if (member == null) return null;
        return WorkspaceMemberDTO.builder()
                .id(member.getId())
                .workspaceId(member.getWorkspaceId())
                .userId(member.getUserId())
                .role(member.getRole())
                .status(member.getStatus())
                .joinedAt(member.getJoinedAt())
                .createdAt(member.getCreatedAt())
                .build();
    }
}
