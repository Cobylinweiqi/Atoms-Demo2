package com.novastudio.backend.prompt.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromptCommand {
    @NotNull(message = "工作空间ID不能为空")
    private Long workspaceId;

    @NotBlank(message = "名称不能为空")
    private String name;

    private String category;

    @NotBlank(message = "系统提示词不能为空")
    private String systemPrompt;

    private String userPromptTemplate;
    private String description;
    private String variables;
}
