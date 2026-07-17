package com.novastudio.backend.prompt.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.prompt.domain.entity.Prompt;
import com.novastudio.backend.prompt.domain.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PromptDomainService {

    private final PromptRepository promptRepository;

    public void checkNameAvailable(Long workspaceId, String name) {
        if (promptRepository.existsByWorkspaceIdAndName(workspaceId, name)) {
            throw new BusinessException(ErrorCode.PROMPT_NOT_FOUND, "提示词名称已存在");
        }
    }

    public Prompt findById(Long id) {
        return promptRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROMPT_NOT_FOUND));
    }
}
