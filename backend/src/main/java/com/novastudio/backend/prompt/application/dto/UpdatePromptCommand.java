package com.novastudio.backend.prompt.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePromptCommand {
    private String name;
    private String category;
    private String systemPrompt;
    private String userPromptTemplate;
    private String description;
    private String variables;
}
