package com.novastudio.backend.workspace.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWorkspaceCommand {
    @NotBlank(message = "工作空间名称不能为空")
    @Size(max = 100, message = "名称不能超过100个字符")
    private String name;

    @NotBlank(message = "工作空间标识不能为空")
    @Size(max = 100, message = "标识不能超过100个字符")
    private String slug;

    private String logoUrl;
}
