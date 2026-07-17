package com.novastudio.backend.theme.application.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.theme.application.assembler.ThemeAssembler;
import com.novastudio.backend.theme.application.dto.ThemeCommands.*;
import com.novastudio.backend.theme.application.dto.ThemeDTO;
import com.novastudio.backend.theme.domain.entity.Theme;
import com.novastudio.backend.theme.domain.repository.ThemeRepository;
import com.novastudio.backend.theme.domain.service.ThemeDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ThemeApplicationService {

    private final ThemeRepository themeRepository;
    private final ThemeDomainService themeDomainService;

    @Transactional
    public ThemeDTO create(CreateThemeCommand command) {
        Theme theme = Theme.create(command.getProjectId(), command.getName(), command.getConfig());
        theme = themeRepository.save(theme);

        log.info("Theme created: id={}, name={}", theme.getId(), theme.getName());
        return ThemeAssembler.toDTO(theme);
    }

    @Transactional
    public ThemeDTO update(Long id, UpdateThemeCommand command) {
        Theme theme = themeDomainService.findById(id);
        theme.update(command.getName(), command.getConfig());
        theme = themeRepository.save(theme);
        return ThemeAssembler.toDTO(theme);
    }

    public ThemeDTO findById(Long id) {
        return ThemeAssembler.toDTO(themeDomainService.findById(id));
    }

    public List<ThemeDTO> findByProjectId(Long projectId) {
        return themeRepository.findByProjectId(projectId).stream()
                .map(ThemeAssembler::toDTO)
                .toList();
    }

    public ThemeDTO findActiveByProjectId(Long projectId) {
        return themeRepository.findActiveByProjectId(projectId)
                .map(ThemeAssembler::toDTO)
                .orElse(null);
    }

    @Transactional
    public ThemeDTO apply(Long id) {
        Theme theme = themeDomainService.findById(id);

        // Deactivate all themes in the same project
        themeRepository.deactivateAllByProjectId(theme.getProjectId());

        // Activate the selected theme
        theme.apply();
        theme = themeRepository.save(theme);

        log.info("Theme applied: id={}, projectId={}", id, theme.getProjectId());
        return ThemeAssembler.toDTO(theme);
    }

    @Transactional
    public void delete(Long id) {
        Theme theme = themeDomainService.findById(id);
        if (Boolean.TRUE.equals(theme.getIsDefault())) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "不能删除默认主题");
        }
        themeRepository.deleteById(id);
        log.info("Theme deleted: id={}", id);
    }

    public String exportTheme(Long themeId, ExportThemeCommand command) {
        Theme theme = themeDomainService.findById(themeId);
        String format = command.getFormat().toLowerCase();

        return switch (format) {
            case "css" -> exportCssVars(theme.getConfig());
            case "tailwind" -> exportTailwind(theme.getConfig());
            case "json" -> theme.getConfig();
            case "scss" -> exportScss(theme.getConfig());
            default -> throw new BusinessException(ErrorCode.BAD_REQUEST, "不支持的导出格式: " + format);
        };
    }

    private String exportCssVars(String config) {
        // Simplified CSS variable export
        return ":root {\n  /* Theme CSS Variables */\n  --primary: #6366f1;\n  --secondary: #8b5cf6;\n  /* Generated from: " + config.substring(0, Math.min(50, config.length())) + "... */\n}";
    }

    private String exportTailwind(String config) {
        return "{\n  \"colors\": {\n    \"primary\": \"#6366f1\",\n    \"secondary\": \"#8b5cf6\"\n  }\n}";
    }

    private String exportScss(String config) {
        return "$primary: #6366f1;\n$secondary: #8b5cf6;\n";
    }
}
