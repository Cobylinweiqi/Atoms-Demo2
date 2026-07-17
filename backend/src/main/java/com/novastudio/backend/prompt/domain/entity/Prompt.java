package com.novastudio.backend.prompt.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Prompt {

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

    public static Prompt create(Long workspaceId, String name, String category, String systemPrompt,
                                 String userPromptTemplate, String description) {
        return Prompt.builder()
                .workspaceId(workspaceId)
                .name(name)
                .category(category)
                .systemPrompt(systemPrompt)
                .userPromptTemplate(userPromptTemplate)
                .description(description)
                .isPublic(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String systemPrompt, String userPromptTemplate, String description, String category) {
        if (name != null && !name.isBlank()) this.name = name;
        if (systemPrompt != null) this.systemPrompt = systemPrompt;
        if (userPromptTemplate != null) this.userPromptTemplate = userPromptTemplate;
        if (description != null) this.description = description;
        if (category != null && !category.isBlank()) this.category = category;
        this.updatedAt = LocalDateTime.now();
    }

    public void setVariables(String variables) {
        this.variables = variables;
        this.updatedAt = LocalDateTime.now();
    }

    public void makePublic() {
        this.isPublic = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void makePrivate() {
        this.isPublic = false;
        this.updatedAt = LocalDateTime.now();
    }
}
