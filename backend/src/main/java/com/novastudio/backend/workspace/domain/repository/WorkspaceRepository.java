package com.novastudio.backend.workspace.domain.repository;

import com.novastudio.backend.workspace.domain.entity.Workspace;
import com.novastudio.backend.workspace.domain.entity.WorkspaceMember;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepository {

    Workspace save(Workspace workspace);

    Optional<Workspace> findById(Long id);

    Optional<Workspace> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Workspace> findByUserId(Long userId);

    void deleteById(Long id);

    // Member operations
    WorkspaceMember saveMember(WorkspaceMember member);

    Optional<WorkspaceMember> findMemberById(Long id);

    Optional<WorkspaceMember> findMemberByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    List<WorkspaceMember> findMembersByWorkspaceId(Long workspaceId);

    boolean existsMemberByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    void deleteMemberById(Long id);
}
