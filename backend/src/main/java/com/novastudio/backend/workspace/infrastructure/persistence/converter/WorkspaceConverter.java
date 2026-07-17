package com.novastudio.backend.workspace.infrastructure.persistence.converter;

import com.novastudio.backend.workspace.domain.entity.Workspace;
import com.novastudio.backend.workspace.domain.entity.WorkspaceMember;
import com.novastudio.backend.workspace.infrastructure.persistence.entity.WorkspaceDO;
import com.novastudio.backend.workspace.infrastructure.persistence.entity.WorkspaceMemberDO;

import java.util.List;

public class WorkspaceConverter {

    private WorkspaceConverter() {}

    public static Workspace toDomain(WorkspaceDO workspaceDO) {
        if (workspaceDO == null) return null;
        return Workspace.builder()
                .id(workspaceDO.getId())
                .name(workspaceDO.getName())
                .slug(workspaceDO.getSlug())
                .ownerId(workspaceDO.getOwnerId())
                .plan(workspaceDO.getPlan())
                .logoUrl(workspaceDO.getLogoUrl())
                .createdAt(workspaceDO.getCreatedAt())
                .updatedAt(workspaceDO.getUpdatedAt())
                .build();
    }

    public static WorkspaceDO toDO(Workspace workspace) {
        if (workspace == null) return null;
        WorkspaceDO workspaceDO = new WorkspaceDO();
        workspaceDO.setId(workspace.getId());
        workspaceDO.setName(workspace.getName());
        workspaceDO.setSlug(workspace.getSlug());
        workspaceDO.setOwnerId(workspace.getOwnerId());
        workspaceDO.setPlan(workspace.getPlan());
        workspaceDO.setLogoUrl(workspace.getLogoUrl());
        workspaceDO.setCreatedAt(workspace.getCreatedAt());
        workspaceDO.setUpdatedAt(workspace.getUpdatedAt());
        return workspaceDO;
    }

    public static List<Workspace> toDomainList(List<WorkspaceDO> workspaceDOs) {
        return workspaceDOs.stream().map(WorkspaceConverter::toDomain).toList();
    }

    public static WorkspaceMember toDomain(WorkspaceMemberDO memberDO) {
        if (memberDO == null) return null;
        return WorkspaceMember.builder()
                .id(memberDO.getId())
                .workspaceId(memberDO.getWorkspaceId())
                .userId(memberDO.getUserId())
                .role(memberDO.getRole())
                .status(memberDO.getStatus())
                .invitedEmail(memberDO.getInvitedEmail())
                .invitedBy(memberDO.getInvitedBy())
                .joinedAt(memberDO.getJoinedAt())
                .createdAt(memberDO.getCreatedAt())
                .updatedAt(memberDO.getUpdatedAt())
                .build();
    }

    public static WorkspaceMemberDO toDO(WorkspaceMember member) {
        if (member == null) return null;
        WorkspaceMemberDO memberDO = new WorkspaceMemberDO();
        memberDO.setId(member.getId());
        memberDO.setWorkspaceId(member.getWorkspaceId());
        memberDO.setUserId(member.getUserId());
        memberDO.setRole(member.getRole());
        memberDO.setStatus(member.getStatus());
        memberDO.setInvitedEmail(member.getInvitedEmail());
        memberDO.setInvitedBy(member.getInvitedBy());
        memberDO.setJoinedAt(member.getJoinedAt());
        memberDO.setCreatedAt(member.getCreatedAt());
        memberDO.setUpdatedAt(member.getUpdatedAt());
        return memberDO;
    }

    public static List<WorkspaceMember> toMemberDomainList(List<WorkspaceMemberDO> memberDOs) {
        return memberDOs.stream().map(WorkspaceConverter::toDomain).toList();
    }
}
