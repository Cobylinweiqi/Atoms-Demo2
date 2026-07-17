package com.novastudio.backend.project.application.assembler;

import com.novastudio.backend.project.application.dto.ProjectDTO;
import com.novastudio.backend.project.domain.entity.Project;

public class ProjectAssembler {

    private ProjectAssembler() {}

    public static ProjectDTO toDTO(Project project) {
        if (project == null) return null;
        return ProjectDTO.builder()
                .id(project.getId())
                .workspaceId(project.getWorkspaceId())
                .name(project.getName())
                .slug(project.getSlug())
                .description(project.getDescription())
                .type(project.getType())
                .framework(project.getFramework())
                .status(project.getStatus())
                .createdBy(project.getCreatedBy())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
