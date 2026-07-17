package com.novastudio.backend.prompt.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromptDTO {
    private Long id;
    private Long workspaceId;
    private String name;
    private String category;
    private String systemPrompt;
    private String userPromptTemplate;
    private String description;
    private String variables;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
