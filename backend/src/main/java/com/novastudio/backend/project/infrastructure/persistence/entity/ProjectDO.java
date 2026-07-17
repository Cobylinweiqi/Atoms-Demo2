package com.novastudio.backend.project.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("projects")
public class ProjectDO extends BaseEntity {
    private Long workspaceId;
    private String name;
    private String slug;
    private String description;
    private String type;
    private String framework;
    private String status;
}
