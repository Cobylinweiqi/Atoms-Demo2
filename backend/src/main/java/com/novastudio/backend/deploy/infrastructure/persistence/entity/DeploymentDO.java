package com.novastudio.backend.deploy.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("deployments")
public class DeploymentDO {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long projectId;
    private String platform;
    private String environment;
    private String url;
    private String status;
    private String buildLog;
    private String envVars;
    private Long deployedBy;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private Integer deleted;
}
