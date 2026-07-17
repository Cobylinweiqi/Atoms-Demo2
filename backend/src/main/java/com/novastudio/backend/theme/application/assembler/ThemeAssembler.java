package com.novastudio.backend.theme.application.assembler;

import com.novastudio.backend.theme.application.dto.ThemeDTO;
import com.novastudio.backend.theme.domain.entity.Theme;

public class ThemeAssembler {

    private ThemeAssembler() {}

    public static ThemeDTO toDTO(Theme theme) {
        if (theme == null) return null;
        return ThemeDTO.builder()
                .id(theme.getId())
                .projectId(theme.getProjectId())
                .name(theme.getName())
                .config(theme.getConfig())
                .isActive(theme.getIsActive())
                .isDefault(theme.getIsDefault())
                .createdAt(theme.getCreatedAt())
                .updatedAt(theme.getUpdatedAt())
                .build();
    }
}
