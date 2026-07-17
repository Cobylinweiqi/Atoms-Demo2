package com.novastudio.backend.component.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ComponentCommands {

    private ComponentCommands() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateComponentCommand {
        @NotNull(message = "项目ID不能为空")
        private Long projectId;

        @NotBlank(message = "组件名称不能为空")
        private String name;

        @NotBlank(message = "组件标识不能为空")
        private String slug;

        private String category;
        private String description;

        @NotBlank(message = "组件源代码不能为空")
        private String sourceCode;

        private String propsSchema;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateComponentCommand {
        private String name;
        private String description;
        private String category;
        private String sourceCode;
        private String propsSchema;
    }
}
