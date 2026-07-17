package com.novastudio.backend.project.application.service;

import com.novastudio.backend.common.security.SecurityUtils;
import com.novastudio.backend.project.application.assembler.ProjectAssembler;
import com.novastudio.backend.project.application.dto.CreateProjectCommand;
import com.novastudio.backend.project.application.dto.ProjectDTO;
import com.novastudio.backend.project.application.dto.UpdateProjectCommand;
import com.novastudio.backend.project.domain.entity.Project;
import com.novastudio.backend.project.domain.repository.ProjectRepository;
import com.novastudio.backend.project.domain.service.ProjectDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectApplicationService {

    private final ProjectRepository projectRepository;
    private final ProjectDomainService projectDomainService;

    @Transactional
    public ProjectDTO create(CreateProjectCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        // 确保用户是工作空间成员
        projectDomainService.ensureMemberAccess(command.getWorkspaceId(), currentUserId);

        // 检查 slug 是否可用
        projectDomainService.checkSlugAvailable(command.getWorkspaceId(), command.getSlug());

        Project project = Project.create(command.getWorkspaceId(), command.getName(),
                command.getSlug(), command.getDescription(), command.getType(), currentUserId);
        project.activate();
        project = projectRepository.save(project);

        log.info("Project created: id={}, name={}", project.getId(), project.getName());
        return ProjectAssembler.toDTO(project);
    }

    @Transactional
    public ProjectDTO update(Long id, UpdateProjectCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Project project = projectDomainService.findById(id);
        projectDomainService.ensureMemberAccess(project.getWorkspaceId(), currentUserId);

        project.update(command.getName(), command.getDescription(), command.getFramework());
        project = projectRepository.save(project);

        return ProjectAssembler.toDTO(project);
    }

    public ProjectDTO findById(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Project project = projectDomainService.findById(id);
        projectDomainService.ensureMemberAccess(project.getWorkspaceId(), currentUserId);
        return ProjectAssembler.toDTO(project);
    }

    public List<ProjectDTO> findByWorkspaceId(Long workspaceId, String type, String status, String search) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        projectDomainService.ensureMemberAccess(workspaceId, currentUserId);

        List<Project> projects = projectRepository.findByWorkspaceId(workspaceId, type, status, search);
        return projects.stream().map(ProjectAssembler::toDTO).toList();
    }

    @Transactional
    public void archive(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Project project = projectDomainService.findById(id);
        projectDomainService.ensureMemberAccess(project.getWorkspaceId(), currentUserId);

        project.archive();
        projectRepository.save(project);
        log.info("Project archived: id={}", id);
    }

    @Transactional
    public void delete(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Project project = projectDomainService.findByIdAllowArchived(id);
        projectDomainService.ensureMemberAccess(project.getWorkspaceId(), currentUserId);

        projectRepository.deleteById(id);
        log.info("Project deleted: id={}", id);
    }

    @Transactional
    public ProjectDTO duplicate(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Project original = projectDomainService.findById(id);
        projectDomainService.ensureMemberAccess(original.getWorkspaceId(), currentUserId);

        String newSlug = original.getSlug() + "-copy-" + System.currentTimeMillis();
        Project copy = Project.create(original.getWorkspaceId(),
                original.getName() + " (副本)", newSlug,
                original.getDescription(), original.getType(), currentUserId);
        copy.activate();
        copy = projectRepository.save(copy);

        log.info("Project duplicated: from={}, to={}", id, copy.getId());
        return ProjectAssembler.toDTO(copy);
    }
}
