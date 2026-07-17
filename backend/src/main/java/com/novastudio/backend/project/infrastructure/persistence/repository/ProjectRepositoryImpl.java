package com.novastudio.backend.project.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.novastudio.backend.project.domain.entity.Project;
import com.novastudio.backend.project.domain.repository.ProjectRepository;
import com.novastudio.backend.project.infrastructure.persistence.converter.ProjectConverter;
import com.novastudio.backend.project.infrastructure.persistence.entity.ProjectDO;
import com.novastudio.backend.project.infrastructure.persistence.mapper.ProjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProjectRepositoryImpl implements ProjectRepository {

    private final ProjectMapper projectMapper;

    @Override
    public Project save(Project project) {
        ProjectDO projectDO = ProjectConverter.toDO(project);
        if (projectDO.getId() == null) {
            projectMapper.insert(projectDO);
        } else {
            projectMapper.updateById(projectDO);
        }
        return ProjectConverter.toDomain(projectDO);
    }

    @Override
    public Optional<Project> findById(Long id) {
        return Optional.ofNullable(ProjectConverter.toDomain(projectMapper.selectById(id)));
    }

    @Override
    public List<Project> findByWorkspaceId(Long workspaceId, String type, String status, String search) {
        LambdaQueryWrapper<ProjectDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProjectDO::getWorkspaceId, workspaceId);

        if (StringUtils.isNotBlank(type)) {
            wrapper.eq(ProjectDO::getType, type);
        }
        if (StringUtils.isNotBlank(status)) {
            wrapper.eq(ProjectDO::getStatus, status);
        }
        if (StringUtils.isNotBlank(search)) {
            wrapper.and(w -> w.like(ProjectDO::getName, search)
                    .or().like(ProjectDO::getDescription, search));
        }
        wrapper.orderByDesc(ProjectDO::getCreatedAt);
        return ProjectConverter.toDomainList(projectMapper.selectList(wrapper));
    }

    @Override
    public boolean existsByWorkspaceIdAndSlug(Long workspaceId, String slug) {
        LambdaQueryWrapper<ProjectDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProjectDO::getWorkspaceId, workspaceId)
               .eq(ProjectDO::getSlug, slug);
        return projectMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void deleteById(Long id) {
        projectMapper.deleteById(id);
    }

    @Override
    public long countByWorkspaceId(Long workspaceId) {
        LambdaQueryWrapper<ProjectDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProjectDO::getWorkspaceId, workspaceId)
               .ne(ProjectDO::getStatus, "archived");
        return projectMapper.selectCount(wrapper);
    }
}
