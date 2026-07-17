package com.novastudio.backend.agent.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("agent_flows")
public class AgentDO extends BaseEntity {
    private Long projectId;
    private String name;
    private String description;
    private String nodes;
    private String edges;
    private String triggerType;
    private String triggerConfig;
    private String status;
}
