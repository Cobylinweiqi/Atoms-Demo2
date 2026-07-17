package com.novastudio.backend.workspace.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.workspace.domain.entity.Workspace;
import com.novastudio.backend.workspace.domain.entity.WorkspaceMember;
import com.novastudio.backend.workspace.domain.repository.WorkspaceRepository;
import com.novastudio.backend.workspace.infrastructure.persistence.converter.WorkspaceConverter;
import com.novastudio.backend.workspace.infrastructure.persistence.entity.WorkspaceDO;
import com.novastudio.backend.workspace.infrastructure.persistence.entity.WorkspaceMemberDO;
import com.novastudio.backend.workspace.infrastructure.persistence.mapper.WorkspaceMapper;
import com.novastudio.backend.workspace.infrastructure.persistence.mapper.WorkspaceMemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class WorkspaceRepositoryImpl implements WorkspaceRepository {

    private final WorkspaceMapper workspaceMapper;
    private final WorkspaceMemberMapper workspaceMemberMapper;

    @Override
    public Workspace save(Workspace workspace) {
        WorkspaceDO workspaceDO = WorkspaceConverter.toDO(workspace);
        if (workspaceDO.getId() == null) {
            workspaceMapper.insert(workspaceDO);
        } else {
            workspaceMapper.updateById(workspaceDO);
        }
        return WorkspaceConverter.toDomain(workspaceDO);
    }

    @Override
    public Optional<Workspace> findById(Long id) {
        return Optional.ofNullable(WorkspaceConverter.toDomain(workspaceMapper.selectById(id)));
    }

    @Override
    public Optional<Workspace> findBySlug(String slug) {
        LambdaQueryWrapper<WorkspaceDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WorkspaceDO::getSlug, slug);
        return Optional.ofNullable(WorkspaceConverter.toDomain(workspaceMapper.selectOne(wrapper)));
    }

    @Override
    public boolean existsBySlug(String slug) {
        LambdaQueryWrapper<WorkspaceDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WorkspaceDO::getSlug, slug);
        return workspaceMapper.selectCount(wrapper) > 0;
    }

    @Override
    public List<Workspace> findByUserId(Long userId) {
        return WorkspaceConverter.toDomainList(workspaceMapper.selectByUserId(userId));
    }

    @Override
    public void deleteById(Long id) {
        workspaceMapper.deleteById(id);
    }

    @Override
    public WorkspaceMember saveMember(WorkspaceMember member) {
        WorkspaceMemberDO memberDO = WorkspaceConverter.toDO(member);
        if (memberDO.getId() == null) {
            workspaceMemberMapper.insert(memberDO);
        } else {
            workspaceMemberMapper.updateById(memberDO);
        }
        return WorkspaceConverter.toDomain(memberDO);
    }

    @Override
    public Optional<WorkspaceMember> findMemberById(Long id) {
        return Optional.ofNullable(WorkspaceConverter.toDomain(workspaceMemberMapper.selectById(id)));
    }

    @Override
    public Optional<WorkspaceMember> findMemberByWorkspaceIdAndUserId(Long workspaceId, Long userId) {
        LambdaQueryWrapper<WorkspaceMemberDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WorkspaceMemberDO::getWorkspaceId, workspaceId)
               .eq(WorkspaceMemberDO::getUserId, userId);
        return Optional.ofNullable(WorkspaceConverter.toDomain(workspaceMemberMapper.selectOne(wrapper)));
    }

    @Override
    public List<WorkspaceMember> findMembersByWorkspaceId(Long workspaceId) {
        LambdaQueryWrapper<WorkspaceMemberDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WorkspaceMemberDO::getWorkspaceId, workspaceId)
               .orderByDesc(WorkspaceMemberDO::getCreatedAt);
        return WorkspaceConverter.toMemberDomainList(workspaceMemberMapper.selectList(wrapper));
    }

    @Override
    public boolean existsMemberByWorkspaceIdAndUserId(Long workspaceId, Long userId) {
        LambdaQueryWrapper<WorkspaceMemberDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(WorkspaceMemberDO::getWorkspaceId, workspaceId)
               .eq(WorkspaceMemberDO::getUserId, userId);
        return workspaceMemberMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void deleteMemberById(Long id) {
        workspaceMemberMapper.deleteById(id);
    }
}
