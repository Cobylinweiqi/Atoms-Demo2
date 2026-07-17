package com.novastudio.backend.prompt.infrastructure.persistence.converter;

import com.novastudio.backend.prompt.domain.entity.Prompt;
import com.novastudio.backend.prompt.infrastructure.persistence.entity.PromptDO;

import java.util.List;

public class PromptConverter {

    private PromptConverter() {}

    public static Prompt toDomain(PromptDO promptDO) {
        if (promptDO == null) return null;
        return Prompt.builder()
                .id(promptDO.getId())
                .workspaceId(promptDO.getWorkspaceId())
                .name(promptDO.getName())
                .category(promptDO.getCategory())
                .systemPrompt(promptDO.getSystemPrompt())
                .userPromptTemplate(promptDO.getUserPromptTemplate())
                .description(promptDO.getDescription())
                .variables(promptDO.getVariables())
                .isPublic(promptDO.getIsPublic())
                .createdAt(promptDO.getCreatedAt())
                .updatedAt(promptDO.getUpdatedAt())
                .build();
    }

    public static PromptDO toDO(Prompt prompt) {
        if (prompt == null) return null;
        PromptDO promptDO = new PromptDO();
        promptDO.setId(prompt.getId());
        promptDO.setWorkspaceId(prompt.getWorkspaceId());
        promptDO.setName(prompt.getName());
        promptDO.setCategory(prompt.getCategory());
        promptDO.setSystemPrompt(prompt.getSystemPrompt());
        promptDO.setUserPromptTemplate(prompt.getUserPromptTemplate());
        promptDO.setDescription(prompt.getDescription());
        promptDO.setVariables(prompt.getVariables());
        promptDO.setIsPublic(prompt.getIsPublic());
        promptDO.setCreatedAt(prompt.getCreatedAt());
        promptDO.setUpdatedAt(prompt.getUpdatedAt());
        return promptDO;
    }

    public static List<Prompt> toDomainList(List<PromptDO> promptDOs) {
        return promptDOs.stream().map(PromptConverter::toDomain).toList();
    }
}
