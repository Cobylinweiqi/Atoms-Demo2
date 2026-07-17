package com.novastudio.backend.component.domain.repository;

import com.novastudio.backend.component.domain.entity.Component;

import java.util.List;
import java.util.Optional;

public interface ComponentRepository {

    Component save(Component component);

    Optional<Component> findById(Long id);

    List<Component> findByProjectId(Long projectId, String category, String search);

    List<Component> findPublicLibrary(String category, String search);

    boolean existsByProjectIdAndSlug(Long projectId, String slug);

    void deleteById(Long id);
}
