package com.novastudio.backend.component.infrastructure.persistence.converter;

import com.novastudio.backend.component.domain.entity.Component;
import com.novastudio.backend.component.infrastructure.persistence.entity.ComponentDO;

import java.util.List;

public class ComponentConverter {

    private ComponentConverter() {}

    public static Component toDomain(ComponentDO componentDO) {
        if (componentDO == null) return null;
        return Component.builder()
                .id(componentDO.getId())
                .projectId(componentDO.getProjectId())
                .name(componentDO.getName())
                .slug(componentDO.getSlug())
                .category(componentDO.getCategory())
                .description(componentDO.getDescription())
                .sourceCode(componentDO.getSourceCode())
                .propsSchema(componentDO.getPropsSchema())
                .isCustom(componentDO.getIsCustom())
                .isPublic(componentDO.getIsPublic())
                .createdBy(componentDO.getCreatedBy())
                .createdAt(componentDO.getCreatedAt())
                .updatedAt(componentDO.getUpdatedAt())
                .build();
    }

    public static ComponentDO toDO(Component component) {
        if (component == null) return null;
        ComponentDO componentDO = new ComponentDO();
        componentDO.setId(component.getId());
        componentDO.setProjectId(component.getProjectId());
        componentDO.setName(component.getName());
        componentDO.setSlug(component.getSlug());
        componentDO.setCategory(component.getCategory());
        componentDO.setDescription(component.getDescription());
        componentDO.setSourceCode(component.getSourceCode());
        componentDO.setPropsSchema(component.getPropsSchema());
        componentDO.setIsCustom(component.getIsCustom());
        componentDO.setIsPublic(component.getIsPublic());
        componentDO.setCreatedBy(component.getCreatedBy());
        componentDO.setCreatedAt(component.getCreatedAt());
        componentDO.setUpdatedAt(component.getUpdatedAt());
        return componentDO;
    }

    public static List<Component> toDomainList(List<ComponentDO> componentDOs) {
        return componentDOs.stream().map(ComponentConverter::toDomain).toList();
    }
}
