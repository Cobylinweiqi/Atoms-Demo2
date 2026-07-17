package com.novastudio.backend.theme.infrastructure.persistence.converter;

import com.novastudio.backend.theme.domain.entity.Theme;
import com.novastudio.backend.theme.infrastructure.persistence.entity.ThemeDO;

import java.util.List;

public class ThemeConverter {

    private ThemeConverter() {}

    public static Theme toDomain(ThemeDO themeDO) {
        if (themeDO == null) return null;
        return Theme.builder()
                .id(themeDO.getId())
                .projectId(themeDO.getProjectId())
                .name(themeDO.getName())
                .config(themeDO.getConfig())
                .isActive(themeDO.getIsActive())
                .isDefault(themeDO.getIsDefault())
                .createdAt(themeDO.getCreatedAt())
                .updatedAt(themeDO.getUpdatedAt())
                .build();
    }

    public static ThemeDO toDO(Theme theme) {
        if (theme == null) return null;
        ThemeDO themeDO = new ThemeDO();
        themeDO.setId(theme.getId());
        themeDO.setProjectId(theme.getProjectId());
        themeDO.setName(theme.getName());
        themeDO.setConfig(theme.getConfig());
        themeDO.setIsActive(theme.getIsActive());
        themeDO.setIsDefault(theme.getIsDefault());
        themeDO.setCreatedAt(theme.getCreatedAt());
        themeDO.setUpdatedAt(theme.getUpdatedAt());
        return themeDO;
    }

    public static List<Theme> toDomainList(List<ThemeDO> themeDOs) {
        return themeDOs.stream().map(ThemeConverter::toDomain).toList();
    }
}
