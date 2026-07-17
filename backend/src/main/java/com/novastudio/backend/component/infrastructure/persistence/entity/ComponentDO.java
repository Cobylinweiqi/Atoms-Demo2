package com.novastudio.backend.component.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("components")
public class ComponentDO extends BaseEntity {
    private Long projectId;
    private String name;
    private String slug;
    private String category;
    private String description;
    private String sourceCode;
    private String propsSchema;
    private Boolean isCustom;
    private Boolean isPublic;
}
