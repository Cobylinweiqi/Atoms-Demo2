package com.novastudio.backend.project.domain.repository;

import com.novastudio.backend.project.domain.entity.Project;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository {

    Project save(Project project);

    Optional<Project> findById(Long id);

    List<Project> findByWorkspaceId(Long workspaceId, String type, String status, String search);

    boolean existsByWorkspaceIdAndSlug(Long workspaceId, String slug);

    void deleteById(Long id);

    long countByWorkspaceId(Long workspaceId);
}
