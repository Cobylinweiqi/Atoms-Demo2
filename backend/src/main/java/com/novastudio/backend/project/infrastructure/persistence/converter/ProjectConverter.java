package com.novastudio.backend.project.infrastructure.persistence.converter;

import com.novastudio.backend.project.domain.entity.Project;
import com.novastudio.backend.project.infrastructure.persistence.entity.ProjectDO;

import java.util.List;

public class ProjectConverter {

    private ProjectConverter() {}

    public static Project toDomain(ProjectDO projectDO) {
        if (projectDO == null) return null;
        return Project.builder()
                .id(projectDO.getId())
                .workspaceId(projectDO.getWorkspaceId())
                .name(projectDO.getName())
                .slug(projectDO.getSlug())
                .description(projectDO.getDescription())
                .type(projectDO.getType())
                .framework(projectDO.getFramework())
                .status(projectDO.getStatus())
                .createdBy(projectDO.getCreatedBy())
                .createdAt(projectDO.getCreatedAt())
                .updatedAt(projectDO.getUpdatedAt())
                .build();
    }

    public static ProjectDO toDO(Project project) {
        if (project == null) return null;
        ProjectDO projectDO = new ProjectDO();
        projectDO.setId(project.getId());
        projectDO.setWorkspaceId(project.getWorkspaceId());
        projectDO.setName(project.getName());
        projectDO.setSlug(project.getSlug());
        projectDO.setDescription(project.getDescription());
        projectDO.setType(project.getType());
        projectDO.setFramework(project.getFramework());
        projectDO.setStatus(project.getStatus());
        projectDO.setCreatedBy(project.getCreatedBy());
        projectDO.setCreatedAt(project.getCreatedAt());
        projectDO.setUpdatedAt(project.getUpdatedAt());
        return projectDO;
    }

    public static List<Project> toDomainList(List<ProjectDO> projectDOs) {
        return projectDOs.stream().map(ProjectConverter::toDomain).toList();
    }
}
