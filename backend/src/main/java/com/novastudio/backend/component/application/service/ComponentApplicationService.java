package com.novastudio.backend.component.application.service;

import com.novastudio.backend.common.security.SecurityUtils;
import com.novastudio.backend.component.application.assembler.ComponentAssembler;
import com.novastudio.backend.component.application.dto.ComponentCommands.*;
import com.novastudio.backend.component.application.dto.ComponentDTO;
import com.novastudio.backend.component.domain.entity.Component;
import com.novastudio.backend.component.domain.repository.ComponentRepository;
import com.novastudio.backend.component.domain.service.ComponentDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComponentApplicationService {

    private final ComponentRepository componentRepository;
    private final ComponentDomainService componentDomainService;

    @Transactional
    public ComponentDTO create(CreateComponentCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        componentDomainService.checkSlugAvailable(command.getProjectId(), command.getSlug());

        Component component = Component.create(command.getProjectId(), command.getName(),
                command.getSlug(), command.getCategory(), command.getSourceCode(), currentUserId);
        if (command.getDescription() != null) {
            component.update(null, command.getDescription(), null, null, null);
        }
        if (command.getPropsSchema() != null) {
            component.update(null, null, null, null, command.getPropsSchema());
        }
        component = componentRepository.save(component);

        log.info("Component created: id={}, name={}", component.getId(), component.getName());
        return ComponentAssembler.toDTO(component);
    }

    @Transactional
    public ComponentDTO update(Long id, UpdateComponentCommand command) {
        Component component = componentDomainService.findById(id);
        component.update(command.getName(), command.getDescription(), command.getCategory(),
                command.getSourceCode(), command.getPropsSchema());
        component = componentRepository.save(component);
        return ComponentAssembler.toDTO(component);
    }

    public ComponentDTO findById(Long id) {
        return ComponentAssembler.toDTO(componentDomainService.findById(id));
    }

    public List<ComponentDTO> findByProjectId(Long projectId, String category, String search) {
        return componentRepository.findByProjectId(projectId, category, search).stream()
                .map(ComponentAssembler::toDTO)
                .toList();
    }

    public List<ComponentDTO> findPublicLibrary(String category, String search) {
        return componentRepository.findPublicLibrary(category, search).stream()
                .map(ComponentAssembler::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        componentDomainService.findById(id);
        componentRepository.deleteById(id);
        log.info("Component deleted: id={}", id);
    }

    @Transactional
    public ComponentDTO togglePublic(Long id) {
        Component component = componentDomainService.findById(id);
        if (Boolean.TRUE.equals(component.getIsPublic())) {
            component.makePrivate();
        } else {
            component.makePublic();
        }
        component = componentRepository.save(component);
        return ComponentAssembler.toDTO(component);
    }
}
