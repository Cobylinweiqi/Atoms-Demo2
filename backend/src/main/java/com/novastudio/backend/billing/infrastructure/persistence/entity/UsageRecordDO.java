package com.novastudio.backend.billing.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("usage_records")
public class UsageRecordDO {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long workspaceId;
    private Long userId;
    private String resource;
    private Integer amount;
    private String model;
    private String metadata;
    private LocalDateTime recordedAt;
    private Integer deleted;
}
