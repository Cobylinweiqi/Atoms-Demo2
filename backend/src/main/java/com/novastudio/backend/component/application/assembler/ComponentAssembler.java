package com.novastudio.backend.component.application.assembler;

import com.novastudio.backend.component.application.dto.ComponentDTO;
import com.novastudio.backend.component.domain.entity.Component;

public class ComponentAssembler {

    private ComponentAssembler() {}

    public static ComponentDTO toDTO(Component component) {
        if (component == null) return null;
        return ComponentDTO.builder()
                .id(component.getId())
                .projectId(component.getProjectId())
                .name(component.getName())
                .slug(component.getSlug())
                .category(component.getCategory())
                .description(component.getDescription())
                .sourceCode(component.getSourceCode())
                .propsSchema(component.getPropsSchema())
                .isCustom(component.getIsCustom())
                .isPublic(component.getIsPublic())
                .createdBy(component.getCreatedBy())
                .createdAt(component.getCreatedAt())
                .updatedAt(component.getUpdatedAt())
                .build();
    }
}
