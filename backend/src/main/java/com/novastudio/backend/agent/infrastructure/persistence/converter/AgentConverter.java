package com.novastudio.backend.agent.infrastructure.persistence.converter;

import com.novastudio.backend.agent.domain.entity.Agent;
import com.novastudio.backend.agent.domain.entity.AgentExecution;
import com.novastudio.backend.agent.infrastructure.persistence.entity.AgentDO;
import com.novastudio.backend.agent.infrastructure.persistence.entity.AgentExecutionDO;

import java.util.List;

public class AgentConverter {

    private AgentConverter() {}

    public static Agent toDomain(AgentDO agentDO) {
        if (agentDO == null) return null;
        return Agent.builder()
                .id(agentDO.getId())
                .projectId(agentDO.getProjectId())
                .name(agentDO.getName())
                .description(agentDO.getDescription())
                .nodes(agentDO.getNodes())
                .edges(agentDO.getEdges())
                .triggerType(agentDO.getTriggerType())
                .triggerConfig(agentDO.getTriggerConfig())
                .status(agentDO.getStatus())
                .createdBy(agentDO.getCreatedBy())
                .createdAt(agentDO.getCreatedAt())
                .updatedAt(agentDO.getUpdatedAt())
                .build();
    }

    public static AgentDO toDO(Agent agent) {
        if (agent == null) return null;
        AgentDO agentDO = new AgentDO();
        agentDO.setId(agent.getId());
        agentDO.setProjectId(agent.getProjectId());
        agentDO.setName(agent.getName());
        agentDO.setDescription(agent.getDescription());
        agentDO.setNodes(agent.getNodes());
        agentDO.setEdges(agent.getEdges());
        agentDO.setTriggerType(agent.getTriggerType());
        agentDO.setTriggerConfig(agent.getTriggerConfig());
        agentDO.setStatus(agent.getStatus());
        agentDO.setCreatedBy(agent.getCreatedBy());
        agentDO.setCreatedAt(agent.getCreatedAt());
        agentDO.setUpdatedAt(agent.getUpdatedAt());
        return agentDO;
    }

    public static List<Agent> toDomainList(List<AgentDO> agentDOs) {
        return agentDOs.stream().map(AgentConverter::toDomain).toList();
    }

    public static AgentExecution toDomain(AgentExecutionDO executionDO) {
        if (executionDO == null) return null;
        return AgentExecution.builder()
                .id(executionDO.getId())
                .agentId(executionDO.getAgentId())
                .status(executionDO.getStatus())
                .input(executionDO.getInput())
                .output(executionDO.getOutput())
                .error(executionDO.getError())
                .startedAt(executionDO.getStartedAt())
                .completedAt(executionDO.getCompletedAt())
                .createdAt(executionDO.getCreatedAt())
                .build();
    }

    public static AgentExecutionDO toDO(AgentExecution execution) {
        if (execution == null) return null;
        AgentExecutionDO executionDO = new AgentExecutionDO();
        executionDO.setId(execution.getId());
        executionDO.setAgentId(execution.getAgentId());
        executionDO.setStatus(execution.getStatus());
        executionDO.setInput(execution.getInput());
        executionDO.setOutput(execution.getOutput());
        executionDO.setError(execution.getError());
        executionDO.setStartedAt(execution.getStartedAt());
        executionDO.setCompletedAt(execution.getCompletedAt());
        executionDO.setCreatedAt(execution.getCreatedAt());
        return executionDO;
    }

    public static List<AgentExecution> toExecutionDomainList(List<AgentExecutionDO> executionDOs) {
        return executionDOs.stream().map(AgentConverter::toDomain).toList();
    }
}
