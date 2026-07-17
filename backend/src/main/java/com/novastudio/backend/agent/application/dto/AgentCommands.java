package com.novastudio.backend.agent.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AgentCommands {

    private AgentCommands() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateAgentCommand {
        @NotNull(message = "项目ID不能为空")
        private Long projectId;

        @NotBlank(message = "名称不能为空")
        private String name;

        private String description;
        private String triggerType;
        private String triggerConfig;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateAgentCommand {
        private String name;
        private String description;
        private String triggerType;
        private String triggerConfig;
        private String nodes;
        private String edges;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExecuteAgentCommand {
        private String input;
    }
}
