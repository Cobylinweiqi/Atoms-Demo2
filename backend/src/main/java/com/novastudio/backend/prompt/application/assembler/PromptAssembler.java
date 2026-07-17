package com.novastudio.backend.prompt.application.assembler;

import com.novastudio.backend.prompt.application.dto.PromptDTO;
import com.novastudio.backend.prompt.domain.entity.Prompt;

public class PromptAssembler {

    private PromptAssembler() {}

    public static PromptDTO toDTO(Prompt prompt) {
        if (prompt == null) return null;
        return PromptDTO.builder()
                .id(prompt.getId())
                .workspaceId(prompt.getWorkspaceId())
                .name(prompt.getName())
                .category(prompt.getCategory())
                .systemPrompt(prompt.getSystemPrompt())
                .userPromptTemplate(prompt.getUserPromptTemplate())
                .description(prompt.getDescription())
                .variables(prompt.getVariables())
                .isPublic(prompt.getIsPublic())
                .createdAt(prompt.getCreatedAt())
                .updatedAt(prompt.getUpdatedAt())
                .build();
    }
}
