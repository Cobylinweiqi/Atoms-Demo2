package com.novastudio.backend.role.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("roles")
public class RoleDO extends BaseEntity {
    private Long workspaceId;
    private String name;
    private String code;
    private String description;
    private Boolean isSystem;
}
