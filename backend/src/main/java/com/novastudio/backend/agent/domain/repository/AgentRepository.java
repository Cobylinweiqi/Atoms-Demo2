package com.novastudio.backend.agent.domain.repository;

import com.novastudio.backend.agent.domain.entity.Agent;
import com.novastudio.backend.agent.domain.entity.AgentExecution;

import java.util.List;
import java.util.Optional;

public interface AgentRepository {

    Agent save(Agent agent);

    Optional<Agent> findById(Long id);

    List<Agent> findByProjectId(Long projectId);

    void deleteById(Long id);

    AgentExecution saveExecution(AgentExecution execution);

    Optional<AgentExecution> findExecutionById(Long id);

    List<AgentExecution> findExecutionsByAgentId(Long agentId, int limit);
}
