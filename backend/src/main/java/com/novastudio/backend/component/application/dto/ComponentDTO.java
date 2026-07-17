package com.novastudio.backend.component.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComponentDTO {
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
}
