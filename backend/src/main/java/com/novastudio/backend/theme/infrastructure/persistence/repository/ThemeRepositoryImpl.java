package com.novastudio.backend.theme.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.theme.domain.entity.Theme;
import com.novastudio.backend.theme.domain.repository.ThemeRepository;
import com.novastudio.backend.theme.infrastructure.persistence.converter.ThemeConverter;
import com.novastudio.backend.theme.infrastructure.persistence.entity.ThemeDO;
import com.novastudio.backend.theme.infrastructure.persistence.mapper.ThemeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ThemeRepositoryImpl implements ThemeRepository {

    private final ThemeMapper themeMapper;

    @Override
    public Theme save(Theme theme) {
        ThemeDO themeDO = ThemeConverter.toDO(theme);
        if (themeDO.getId() == null) {
            themeMapper.insert(themeDO);
        } else {
            themeMapper.updateById(themeDO);
        }
        return ThemeConverter.toDomain(themeDO);
    }

    @Override
    public Optional<Theme> findById(Long id) {
        return Optional.ofNullable(ThemeConverter.toDomain(themeMapper.selectById(id)));
    }

    @Override
    public List<Theme> findByProjectId(Long projectId) {
        LambdaQueryWrapper<ThemeDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ThemeDO::getProjectId, projectId)
               .orderByDesc(ThemeDO::getCreatedAt);
        return ThemeConverter.toDomainList(themeMapper.selectList(wrapper));
    }

    @Override
    public Optional<Theme> findActiveByProjectId(Long projectId) {
        LambdaQueryWrapper<ThemeDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ThemeDO::getProjectId, projectId)
               .eq(ThemeDO::getIsActive, true);
        return Optional.ofNullable(ThemeConverter.toDomain(themeMapper.selectOne(wrapper)));
    }

    @Override
    public void deactivateAllByProjectId(Long projectId) {
        themeMapper.deactivateAllByProjectId(projectId);
    }

    @Override
    public void deleteById(Long id) {
        themeMapper.deleteById(id);
    }
}
