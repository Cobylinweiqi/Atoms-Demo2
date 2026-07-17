package com.novastudio.backend.theme.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.theme.domain.entity.Theme;
import com.novastudio.backend.theme.domain.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ThemeDomainService {

    private final ThemeRepository themeRepository;

    public Theme findById(Long id) {
        return themeRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEME_NOT_FOUND));
    }
}
