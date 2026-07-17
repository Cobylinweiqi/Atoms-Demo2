package com.novastudio.backend.project.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.project.domain.entity.Project;
import com.novastudio.backend.project.domain.repository.ProjectRepository;
import com.novastudio.backend.workspace.domain.service.WorkspaceDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectDomainService {

    private final ProjectRepository projectRepository;
    private final WorkspaceDomainService workspaceDomainService;

    public void checkSlugAvailable(Long workspaceId, String slug) {
        if (projectRepository.existsByWorkspaceIdAndSlug(workspaceId, slug)) {
            throw new BusinessException(ErrorCode.PROJECT_SLUG_EXISTS);
        }
    }

    public Project findById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));
        if (project.isArchived()) {
            throw new BusinessException(ErrorCode.PROJECT_ARCHIVED);
        }
        return project;
    }

    public Project findByIdAllowArchived(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));
    }

    public void ensureMemberAccess(Long workspaceId, Long userId) {
        workspaceDomainService.ensureMember(workspaceId, userId);
    }
}
