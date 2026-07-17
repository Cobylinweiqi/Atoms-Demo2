package com.novastudio.backend.prompt.application.service;

import com.novastudio.backend.prompt.application.assembler.PromptAssembler;
import com.novastudio.backend.prompt.application.dto.CreatePromptCommand;
import com.novastudio.backend.prompt.application.dto.PromptDTO;
import com.novastudio.backend.prompt.application.dto.UpdatePromptCommand;
import com.novastudio.backend.prompt.domain.entity.Prompt;
import com.novastudio.backend.prompt.domain.repository.PromptRepository;
import com.novastudio.backend.prompt.domain.service.PromptDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromptApplicationService {

    private final PromptRepository promptRepository;
    private final PromptDomainService promptDomainService;

    @Transactional
    public PromptDTO create(CreatePromptCommand command) {
        promptDomainService.checkNameAvailable(command.getWorkspaceId(), command.getName());

        Prompt prompt = Prompt.create(command.getWorkspaceId(), command.getName(),
                command.getCategory(), command.getSystemPrompt(),
                command.getUserPromptTemplate(), command.getDescription());
        if (command.getVariables() != null) {
            prompt.setVariables(command.getVariables());
        }
        prompt = promptRepository.save(prompt);

        log.info("Prompt created: id={}, name={}", prompt.getId(), prompt.getName());
        return PromptAssembler.toDTO(prompt);
    }

    @Transactional
    public PromptDTO update(Long id, UpdatePromptCommand command) {
        Prompt prompt = promptDomainService.findById(id);

        prompt.update(command.getName(), command.getSystemPrompt(),
                command.getUserPromptTemplate(), command.getDescription(), command.getCategory());
        if (command.getVariables() != null) {
            prompt.setVariables(command.getVariables());
        }
        prompt = promptRepository.save(prompt);

        return PromptAssembler.toDTO(prompt);
    }

    public PromptDTO findById(Long id) {
        return PromptAssembler.toDTO(promptDomainService.findById(id));
    }

    public List<PromptDTO> findByWorkspaceId(Long workspaceId, String category, String search) {
        return promptRepository.findByWorkspaceId(workspaceId, category, search).stream()
                .map(PromptAssembler::toDTO)
                .toList();
    }

    public List<PromptDTO> findPublicPrompts(String category) {
        return promptRepository.findPublicPrompts(category).stream()
                .map(PromptAssembler::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        promptDomainService.findById(id);
        promptRepository.deleteById(id);
        log.info("Prompt deleted: id={}", id);
    }

    @Transactional
    public PromptDTO togglePublic(Long id) {
        Prompt prompt = promptDomainService.findById(id);
        if (Boolean.TRUE.equals(prompt.getIsPublic())) {
            prompt.makePrivate();
        } else {
            prompt.makePublic();
        }
        prompt = promptRepository.save(prompt);
        return PromptAssembler.toDTO(prompt);
    }
}
