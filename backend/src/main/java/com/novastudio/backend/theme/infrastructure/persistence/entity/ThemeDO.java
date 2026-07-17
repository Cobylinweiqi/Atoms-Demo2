package com.novastudio.backend.theme.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("theme_configs")
public class ThemeDO extends BaseEntity {
    private Long projectId;
    private String name;
    private String config;
    private Boolean isActive;
    private Boolean isDefault;
}
