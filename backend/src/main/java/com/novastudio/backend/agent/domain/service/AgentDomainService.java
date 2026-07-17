package com.novastudio.backend.agent.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.agent.domain.entity.Agent;
import com.novastudio.backend.agent.domain.entity.AgentExecution;
import com.novastudio.backend.agent.domain.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentDomainService {

    private final AgentRepository agentRepository;

    public Agent findById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.AGENT_NOT_FOUND));
    }

    public void ensureActive(Agent agent) {
        if (!agent.isActive()) {
            throw new BusinessException(ErrorCode.AGENT_EXECUTION_FAILED, "Agent未激活");
        }
    }

    public List<AgentExecution> getExecutions(Long agentId, int limit) {
        return agentRepository.findExecutionsByAgentId(agentId, limit);
    }
}
