package com.novastudio.backend.deploy.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class DeployCommands {

    private DeployCommands() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateDeploymentCommand {
        @NotNull(message = "项目ID不能为空")
        private Long projectId;

        @NotBlank(message = "部署平台不能为空")
        private String platform;

        private String environment;
        private String envVars;
    }
}
