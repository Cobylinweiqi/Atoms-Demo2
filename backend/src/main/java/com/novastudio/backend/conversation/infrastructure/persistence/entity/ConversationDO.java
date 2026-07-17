package com.novastudio.backend.conversation.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("conversations")
public class ConversationDO extends BaseEntity {
    private Long projectId;
    private Long userId;
    private String title;
    private String model;
}
