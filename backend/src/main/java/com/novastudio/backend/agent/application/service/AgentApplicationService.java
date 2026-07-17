package com.novastudio.backend.agent.application.service;

import com.novastudio.backend.agent.application.assembler.AgentAssembler;
import com.novastudio.backend.agent.application.dto.AgentCommands.*;
import com.novastudio.backend.agent.application.dto.AgentDTO;
import com.novastudio.backend.agent.application.dto.AgentExecutionDTO;
import com.novastudio.backend.agent.domain.entity.Agent;
import com.novastudio.backend.agent.domain.entity.AgentExecution;
import com.novastudio.backend.agent.domain.repository.AgentRepository;
import com.novastudio.backend.agent.domain.service.AgentDomainService;
import com.novastudio.backend.common.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgentApplicationService {

    private final AgentRepository agentRepository;
    private final AgentDomainService agentDomainService;

    @Transactional
    public AgentDTO create(CreateAgentCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        Agent agent = Agent.create(command.getProjectId(), command.getName(),
                command.getDescription(), command.getTriggerType(), currentUserId);
        if (command.getTriggerConfig() != null) {
            agent.update(null, null, null, command.getTriggerConfig());
        }
        agent = agentRepository.save(agent);

        log.info("Agent created: id={}, name={}", agent.getId(), agent.getName());
        return AgentAssembler.toDTO(agent);
    }

    @Transactional
    public AgentDTO update(Long id, UpdateAgentCommand command) {
        Agent agent = agentDomainService.findById(id);

        agent.update(command.getName(), command.getDescription(),
                command.getTriggerType(), command.getTriggerConfig());
        if (command.getNodes() != null && command.getEdges() != null) {
            agent.updateFlow(command.getNodes(), command.getEdges());
        }
        agent = agentRepository.save(agent);

        return AgentAssembler.toDTO(agent);
    }

    public AgentDTO findById(Long id) {
        return AgentAssembler.toDTO(agentDomainService.findById(id));
    }

    public List<AgentDTO> findByProjectId(Long projectId) {
        return agentRepository.findByProjectId(projectId).stream()
                .map(AgentAssembler::toDTO)
                .toList();
    }

    @Transactional
    public AgentDTO activate(Long id) {
        Agent agent = agentDomainService.findById(id);
        agent.activate();
        agent = agentRepository.save(agent);
        log.info("Agent activated: id={}", id);
        return AgentAssembler.toDTO(agent);
    }

    @Transactional
    public AgentDTO pause(Long id) {
        Agent agent = agentDomainService.findById(id);
        agent.pause();
        agent = agentRepository.save(agent);
        log.info("Agent paused: id={}", id);
        return AgentAssembler.toDTO(agent);
    }

    @Transactional
    public void delete(Long id) {
        agentDomainService.findById(id);
        agentRepository.deleteById(id);
        log.info("Agent deleted: id={}", id);
    }

    @Transactional
    public AgentExecutionDTO execute(Long id, ExecuteAgentCommand command) {
        Agent agent = agentDomainService.findById(id);
        agentDomainService.ensureActive(agent);

        AgentExecution execution = AgentExecution.create(id, command.getInput());
        execution = agentRepository.saveExecution(execution);

        // Simulate execution
        execution.start();
        agentRepository.saveExecution(execution);

        try {
            // In real implementation, this would execute the agent flow DAG
            Thread.sleep(100);
            execution.complete("{\"result\": \"执行完成\"}");
        } catch (Exception e) {
            execution.fail(e.getMessage());
        }
        execution = agentRepository.saveExecution(execution);

        log.info("Agent executed: id={}, executionId={}", id, execution.getId());
        return AgentAssembler.toExecutionDTO(execution);
    }

    public List<AgentExecutionDTO> findExecutions(Long agentId, int limit) {
        return agentDomainService.getExecutions(agentId, limit).stream()
                .map(AgentAssembler::toExecutionDTO)
                .toList();
    }

    public AgentExecutionDTO findExecutionById(Long executionId) {
        return agentRepository.findExecutionById(executionId)
                .map(AgentAssembler::toExecutionDTO)
                .orElse(null);
    }
}
