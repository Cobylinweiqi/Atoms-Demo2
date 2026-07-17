package com.novastudio.backend.theme.domain.repository;

import com.novastudio.backend.theme.domain.entity.Theme;

import java.util.List;
import java.util.Optional;

public interface ThemeRepository {

    Theme save(Theme theme);

    Optional<Theme> findById(Long id);

    List<Theme> findByProjectId(Long projectId);

    Optional<Theme> findActiveByProjectId(Long projectId);

    void deactivateAllByProjectId(Long projectId);

    void deleteById(Long id);
}
