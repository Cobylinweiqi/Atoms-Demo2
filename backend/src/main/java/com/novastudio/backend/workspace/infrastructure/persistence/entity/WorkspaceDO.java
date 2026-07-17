package com.novastudio.backend.workspace.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("workspaces")
public class WorkspaceDO extends BaseEntity {
    private String name;
    private String slug;
    private Long ownerId;
    private String plan;
    private String logoUrl;
}
