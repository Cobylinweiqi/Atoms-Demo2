package com.novastudio.backend.theme.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Theme {

    private Long id;
    private Long projectId;
    private String name;
    private String config;
    private Boolean isActive;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Theme create(Long projectId, String name, String config) {
        return Theme.builder()
                .projectId(projectId)
                .name(name)
                .config(config)
                .isActive(false)
                .isDefault(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String config) {
        if (name != null && !name.isBlank()) this.name = name;
        if (config != null) this.config = config;
        this.updatedAt = LocalDateTime.now();
    }

    public void apply() {
        this.isActive = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void unapply() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void setAsDefault() {
        this.isDefault = true;
        this.updatedAt = LocalDateTime.now();
    }
}
