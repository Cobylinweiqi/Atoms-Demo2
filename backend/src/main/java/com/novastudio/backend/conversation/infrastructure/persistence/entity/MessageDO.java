package com.novastudio.backend.conversation.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("messages")
public class MessageDO {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long conversationId;
    private String role;
    private String content;
    private String toolCalls;
    private String toolResults;
    private String model;
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;
    private BigDecimal costUsd;
    private LocalDateTime createdAt;
    private Integer deleted;
}
