package com.novastudio.backend.project.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 项目领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project {

    private Long id;
    private Long workspaceId;
    private String name;
    private String slug;
    private String description;
    private String type;
    private String framework;
    private String status;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Project create(Long workspaceId, String name, String slug, String description,
                                  String type, Long createdBy) {
        return Project.builder()
                .workspaceId(workspaceId)
                .name(name)
                .slug(slug)
                .description(description)
                .type(type)
                .framework("nextjs")
                .status("draft")
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String description, String framework) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (description != null) {
            this.description = description;
        }
        if (framework != null && !framework.isBlank()) {
            this.framework = framework;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.status = "active";
        this.updatedAt = LocalDateTime.now();
    }

    public void archive() {
        this.status = "archived";
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isArchived() {
        return "archived".equals(this.status);
    }
}
