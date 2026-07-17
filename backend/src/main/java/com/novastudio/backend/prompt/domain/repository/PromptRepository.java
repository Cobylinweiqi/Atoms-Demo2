package com.novastudio.backend.prompt.domain.repository;

import com.novastudio.backend.prompt.domain.entity.Prompt;

import java.util.List;
import java.util.Optional;

public interface PromptRepository {

    Prompt save(Prompt prompt);

    Optional<Prompt> findById(Long id);

    List<Prompt> findByWorkspaceId(Long workspaceId, String category, String search);

    List<Prompt> findPublicPrompts(String category);

    boolean existsByWorkspaceIdAndName(Long workspaceId, String name);

    void deleteById(Long id);
}
