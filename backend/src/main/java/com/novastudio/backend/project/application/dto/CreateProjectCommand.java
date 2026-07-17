package com.novastudio.backend.project.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectCommand {
    @NotNull(message = "工作空间ID不能为空")
    private Long workspaceId;

    @NotBlank(message = "项目名称不能为空")
    @Size(max = 200, message = "项目名称不能超过200个字符")
    private String name;

    @NotBlank(message = "项目标识不能为空")
    @Size(max = 200, message = "项目标识不能超过200个字符")
    private String slug;

    private String description;

    @NotBlank(message = "项目类型不能为空")
    private String type;
}
