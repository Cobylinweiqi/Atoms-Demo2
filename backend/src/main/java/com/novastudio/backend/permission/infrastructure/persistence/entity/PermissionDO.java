package com.novastudio.backend.permission.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("permissions")
public class PermissionDO extends BaseEntity {
    private String name;
    private String code;
    private String resource;
    private String action;
    private String description;
    private Boolean isSystem;
}
