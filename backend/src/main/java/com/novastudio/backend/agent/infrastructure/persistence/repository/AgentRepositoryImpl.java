package com.novastudio.backend.agent.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.agent.domain.entity.Agent;
import com.novastudio.backend.agent.domain.entity.AgentExecution;
import com.novastudio.backend.agent.domain.repository.AgentRepository;
import com.novastudio.backend.agent.infrastructure.persistence.converter.AgentConverter;
import com.novastudio.backend.agent.infrastructure.persistence.entity.AgentDO;
import com.novastudio.backend.agent.infrastructure.persistence.entity.AgentExecutionDO;
import com.novastudio.backend.agent.infrastructure.persistence.mapper.AgentExecutionMapper;
import com.novastudio.backend.agent.infrastructure.persistence.mapper.AgentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AgentRepositoryImpl implements AgentRepository {

    private final AgentMapper agentMapper;
    private final AgentExecutionMapper agentExecutionMapper;

    @Override
    public Agent save(Agent agent) {
        AgentDO agentDO = AgentConverter.toDO(agent);
        if (agentDO.getId() == null) {
            agentMapper.insert(agentDO);
        } else {
            agentMapper.updateById(agentDO);
        }
        return AgentConverter.toDomain(agentDO);
    }

    @Override
    public Optional<Agent> findById(Long id) {
        return Optional.ofNullable(AgentConverter.toDomain(agentMapper.selectById(id)));
    }

    @Override
    public List<Agent> findByProjectId(Long projectId) {
        LambdaQueryWrapper<AgentDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(AgentDO::getProjectId, projectId)
               .orderByDesc(AgentDO::getCreatedAt);
        return AgentConverter.toDomainList(agentMapper.selectList(wrapper));
    }

    @Override
    public void deleteById(Long id) {
        agentMapper.deleteById(id);
    }

    @Override
    public AgentExecution saveExecution(AgentExecution execution) {
        AgentExecutionDO executionDO = AgentConverter.toDO(execution);
        if (executionDO.getId() == null) {
            agentExecutionMapper.insert(executionDO);
        } else {
            agentExecutionMapper.updateById(executionDO);
        }
        return AgentConverter.toDomain(executionDO);
    }

    @Override
    public Optional<AgentExecution> findExecutionById(Long id) {
        return Optional.ofNullable(AgentConverter.toDomain(agentExecutionMapper.selectById(id)));
    }

    @Override
    public List<AgentExecution> findExecutionsByAgentId(Long agentId, int limit) {
        return AgentConverter.toExecutionDomainList(
                agentExecutionMapper.selectByAgentId(agentId, limit));
    }
}
