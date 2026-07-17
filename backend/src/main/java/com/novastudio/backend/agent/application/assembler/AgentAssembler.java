package com.novastudio.backend.agent.application.assembler;

import com.novastudio.backend.agent.application.dto.AgentDTO;
import com.novastudio.backend.agent.application.dto.AgentExecutionDTO;
import com.novastudio.backend.agent.domain.entity.Agent;
import com.novastudio.backend.agent.domain.entity.AgentExecution;

public class AgentAssembler {

    private AgentAssembler() {}

    public static AgentDTO toDTO(Agent agent) {
        if (agent == null) return null;
        return AgentDTO.builder()
                .id(agent.getId())
                .projectId(agent.getProjectId())
                .name(agent.getName())
                .description(agent.getDescription())
                .nodes(agent.getNodes())
                .edges(agent.getEdges())
                .triggerType(agent.getTriggerType())
                .triggerConfig(agent.getTriggerConfig())
                .status(agent.getStatus())
                .createdBy(agent.getCreatedBy())
                .createdAt(agent.getCreatedAt())
                .updatedAt(agent.getUpdatedAt())
                .build();
    }

    public static AgentExecutionDTO toExecutionDTO(AgentExecution execution) {
        if (execution == null) return null;
        return AgentExecutionDTO.builder()
                .id(execution.getId())
                .agentId(execution.getAgentId())
                .status(execution.getStatus())
                .input(execution.getInput())
                .output(execution.getOutput())
                .error(execution.getError())
                .startedAt(execution.getStartedAt())
                .completedAt(execution.getCompletedAt())
                .createdAt(execution.getCreatedAt())
                .build();
    }
}
