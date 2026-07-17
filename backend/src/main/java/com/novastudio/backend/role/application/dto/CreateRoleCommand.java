package com.novastudio.backend.role.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleCommand {
    @NotNull(message = "工作空间ID不能为空")
    private Long workspaceId;

    @NotBlank(message = "角色名称不能为空")
    @Size(max = 100, message = "角色名称不能超过100个字符")
    private String name;

    @NotBlank(message = "角色编码不能为空")
    @Size(max = 100, message = "角色编码不能超过100个字符")
    private String code;

    private String description;
    private Set<Long> permissionIds;
}
