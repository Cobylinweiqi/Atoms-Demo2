package com.novastudio.backend.theme.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ThemeCommands {

    private ThemeCommands() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateThemeCommand {
        @NotNull(message = "项目ID不能为空")
        private Long projectId;

        @NotBlank(message = "主题名称不能为空")
        private String name;

        @NotBlank(message = "主题配置不能为空")
        private String config;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateThemeCommand {
        private String name;
        private String config;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExportThemeCommand {
        @NotBlank(message = "导出格式不能为空")
        private String format;  // css / tailwind / json / scss
    }
}
