package com.novastudio.backend.workspace.application.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.common.security.SecurityUtils;
import com.novastudio.backend.workspace.application.assembler.WorkspaceAssembler;
import com.novastudio.backend.workspace.application.dto.*;
import com.novastudio.backend.workspace.domain.entity.Workspace;
import com.novastudio.backend.workspace.domain.entity.WorkspaceMember;
import com.novastudio.backend.workspace.domain.repository.WorkspaceRepository;
import com.novastudio.backend.workspace.domain.service.WorkspaceDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkspaceApplicationService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceDomainService workspaceDomainService;

    @Transactional
    public WorkspaceDTO create(CreateWorkspaceCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        workspaceDomainService.checkSlugAvailable(command.getSlug());

        Workspace workspace = Workspace.create(command.getName(), command.getSlug(), currentUserId);
        workspace = workspaceRepository.save(workspace);

        // 创建者为 owner
        WorkspaceMember member = WorkspaceMember.create(workspace.getId(), currentUserId, "owner", currentUserId);
        workspaceRepository.saveMember(member);

        log.info("Workspace created: id={}, slug={}", workspace.getId(), workspace.getSlug());
        return WorkspaceAssembler.toDTO(workspace, "owner");
    }

    @Transactional
    public WorkspaceDTO update(Long id, UpdateWorkspaceCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Workspace workspace = workspaceDomainService.findById(id);
        WorkspaceMember member = workspaceDomainService.findMember(id, currentUserId);
        workspaceDomainService.ensureAdmin(member);

        workspace.update(command.getName(), command.getLogoUrl());
        workspace = workspaceRepository.save(workspace);

        return WorkspaceAssembler.toDTO(workspace, member.getRole());
    }

    public WorkspaceDTO findById(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Workspace workspace = workspaceDomainService.findById(id);
        workspaceDomainService.ensureMember(id, currentUserId);
        WorkspaceMember member = workspaceDomainService.findMember(id, currentUserId);
        return WorkspaceAssembler.toDTO(workspace, member.getRole());
    }

    public List<WorkspaceDTO> findMyWorkspaces() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        List<Workspace> workspaces = workspaceRepository.findByUserId(currentUserId);
        return workspaces.stream()
                .map(ws -> {
                    WorkspaceMember member = workspaceDomainService.findMember(ws.getId(), currentUserId);
                    return WorkspaceAssembler.toDTO(ws, member.getRole());
                })
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        workspaceDomainService.findById(id);
        WorkspaceMember member = workspaceDomainService.findMember(id, currentUserId);
        workspaceDomainService.ensureOwner(member);

        workspaceRepository.deleteById(id);
        log.info("Workspace deleted: id={}", id);
    }

    // ===== Member Management =====

    @Transactional
    public WorkspaceMemberDTO inviteMember(Long workspaceId, InviteMemberCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        WorkspaceMember inviter = workspaceDomainService.findMember(workspaceId, currentUserId);
        workspaceDomainService.ensureAdmin(inviter);

        // Check if already a member
        if (workspaceRepository.existsMemberByWorkspaceIdAndUserId(workspaceId, 0L)) {
            throw new BusinessException(ErrorCode.WORKSPACE_MEMBER_EXISTS);
        }

        WorkspaceMember member = WorkspaceMember.invite(workspaceId, command.getEmail(),
                command.getRole(), currentUserId);
        member = workspaceRepository.saveMember(member);

        log.info("Member invited: workspaceId={}, email={}", workspaceId, command.getEmail());
        return WorkspaceAssembler.toMemberDTO(member);
    }

    public List<WorkspaceMemberDTO> findMembers(Long workspaceId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        workspaceDomainService.ensureMember(workspaceId, currentUserId);
        List<WorkspaceMember> members = workspaceDomainService.findMembers(workspaceId);
        return members.stream().map(WorkspaceAssembler::toMemberDTO).toList();
    }

    @Transactional
    public WorkspaceMemberDTO updateMemberRole(Long workspaceId, Long memberId, String newRole) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        WorkspaceMember operator = workspaceDomainService.findMember(workspaceId, currentUserId);
        workspaceDomainService.ensureAdmin(operator);

        WorkspaceMember member = workspaceRepository.findMemberById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_MEMBER_NOT_FOUND));

        if (member.isOwner()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "不能修改所有者角色");
        }

        member.changeRole(newRole);
        member = workspaceRepository.saveMember(member);

        return WorkspaceAssembler.toMemberDTO(member);
    }

    @Transactional
    public void removeMember(Long workspaceId, Long memberId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        WorkspaceMember operator = workspaceDomainService.findMember(workspaceId, currentUserId);
        workspaceDomainService.ensureAdmin(operator);

        WorkspaceMember member = workspaceRepository.findMemberById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_MEMBER_NOT_FOUND));

        if (member.isOwner()) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "不能移除所有者");
        }

        workspaceRepository.deleteMemberById(memberId);
        log.info("Member removed: workspaceId={}, memberId={}", workspaceId, memberId);
    }
}
