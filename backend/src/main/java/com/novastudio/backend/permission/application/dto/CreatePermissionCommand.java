package com.novastudio.backend.permission.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePermissionCommand {
    @NotBlank(message = "权限名称不能为空")
    private String name;

    @NotBlank(message = "权限编码不能为空")
    private String code;

    @NotBlank(message = "资源不能为空")
    private String resource;

    @NotBlank(message = "操作不能为空")
    private String action;

    private String description;
}
