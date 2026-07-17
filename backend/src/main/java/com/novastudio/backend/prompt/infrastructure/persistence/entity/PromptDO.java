package com.novastudio.backend.prompt.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("prompts")
public class PromptDO extends BaseEntity {
    private Long workspaceId;
    private String name;
    private String category;
    private String systemPrompt;
    private String userPromptTemplate;
    private String description;
    private String variables;
    private Boolean isPublic;
}
