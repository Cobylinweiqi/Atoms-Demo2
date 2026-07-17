package com.novastudio.backend.component.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Component {

    private Long id;
    private Long projectId;
    private String name;
    private String slug;
    private String category;
    private String description;
    private String sourceCode;
    private String propsSchema;
    private Boolean isCustom;
    private Boolean isPublic;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Component create(Long projectId, String name, String slug, String category,
                                    String sourceCode, Long createdBy) {
        return Component.builder()
                .projectId(projectId)
                .name(name)
                .slug(slug)
                .category(category != null ? category : "display")
                .sourceCode(sourceCode)
                .isCustom(true)
                .isPublic(false)
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String description, String category, String sourceCode, String propsSchema) {
        if (name != null && !name.isBlank()) this.name = name;
        if (description != null) this.description = description;
        if (category != null && !category.isBlank()) this.category = category;
        if (sourceCode != null) this.sourceCode = sourceCode;
        if (propsSchema != null) this.propsSchema = propsSchema;
        this.updatedAt = LocalDateTime.now();
    }

    public void makePublic() {
        this.isPublic = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void makePrivate() {
        this.isPublic = false;
        this.updatedAt = LocalDateTime.now();
    }
}
