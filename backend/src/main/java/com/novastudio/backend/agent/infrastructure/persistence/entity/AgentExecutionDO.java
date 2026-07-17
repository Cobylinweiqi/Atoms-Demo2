package com.novastudio.backend.agent.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("agent_executions")
public class AgentExecutionDO {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long agentId;
    private String status;
    private String input;
    private String output;
    private String error;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private Integer deleted;
}
