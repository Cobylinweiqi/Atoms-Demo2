package com.novastudio.backend.workspace.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.workspace.domain.entity.Workspace;
import com.novastudio.backend.workspace.domain.entity.WorkspaceMember;
import com.novastudio.backend.workspace.domain.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceDomainService {

    private final WorkspaceRepository workspaceRepository;

    public void checkSlugAvailable(String slug) {
        if (workspaceRepository.existsBySlug(slug)) {
            throw new BusinessException(ErrorCode.WORKSPACE_SLUG_EXISTS);
        }
    }

    public Workspace findById(Long id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    public WorkspaceMember findMember(Long workspaceId, Long userId) {
        return workspaceRepository.findMemberByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_MEMBER_NOT_FOUND));
    }

    public void ensureMember(Long workspaceId, Long userId) {
        if (!workspaceRepository.existsMemberByWorkspaceIdAndUserId(workspaceId, userId)) {
            throw new BusinessException(ErrorCode.WORKSPACE_MEMBER_NOT_FOUND);
        }
    }

    public void ensureAdmin(WorkspaceMember member) {
        if (!member.isAdmin()) {
            throw new BusinessException(ErrorCode.WORKSPACE_INSUFFICIENT_PERMISSIONS);
        }
    }

    public void ensureOwner(WorkspaceMember member) {
        if (!member.isOwner()) {
            throw new BusinessException(ErrorCode.WORKSPACE_INSUFFICIENT_PERMISSIONS);
        }
    }

    public List<WorkspaceMember> findMembers(Long workspaceId) {
        return workspaceRepository.findMembersByWorkspaceId(workspaceId);
    }
}
