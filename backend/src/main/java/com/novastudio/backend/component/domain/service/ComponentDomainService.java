package com.novastudio.backend.component.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.component.domain.entity.Component;
import com.novastudio.backend.component.domain.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ComponentDomainService {

    private final ComponentRepository componentRepository;

    public Component findById(Long id) {
        return componentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMPONENT_NOT_FOUND));
    }

    public void checkSlugAvailable(Long projectId, String slug) {
        if (componentRepository.existsByProjectIdAndSlug(projectId, slug)) {
            throw new BusinessException(ErrorCode.COMPONENT_NOT_FOUND, "组件标识已存在");
        }
    }
}
