package com.novastudio.backend.component.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.novastudio.backend.component.domain.entity.Component;
import com.novastudio.backend.component.domain.repository.ComponentRepository;
import com.novastudio.backend.component.infrastructure.persistence.converter.ComponentConverter;
import com.novastudio.backend.component.infrastructure.persistence.entity.ComponentDO;
import com.novastudio.backend.component.infrastructure.persistence.mapper.ComponentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ComponentRepositoryImpl implements ComponentRepository {

    private final ComponentMapper componentMapper;

    @Override
    public Component save(Component component) {
        ComponentDO componentDO = ComponentConverter.toDO(component);
        if (componentDO.getId() == null) {
            componentMapper.insert(componentDO);
        } else {
            componentMapper.updateById(componentDO);
        }
        return ComponentConverter.toDomain(componentDO);
    }

    @Override
    public Optional<Component> findById(Long id) {
        return Optional.ofNullable(ComponentConverter.toDomain(componentMapper.selectById(id)));
    }

    @Override
    public List<Component> findByProjectId(Long projectId, String category, String search) {
        LambdaQueryWrapper<ComponentDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ComponentDO::getProjectId, projectId);
        if (StringUtils.isNotBlank(category)) {
            wrapper.eq(ComponentDO::getCategory, category);
        }
        if (StringUtils.isNotBlank(search)) {
            wrapper.and(w -> w.like(ComponentDO::getName, search)
                    .or().like(ComponentDO::getDescription, search));
        }
        wrapper.orderByDesc(ComponentDO::getCreatedAt);
        return ComponentConverter.toDomainList(componentMapper.selectList(wrapper));
    }

    @Override
    public List<Component> findPublicLibrary(String category, String search) {
        LambdaQueryWrapper<ComponentDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ComponentDO::getIsPublic, true);
        if (StringUtils.isNotBlank(category)) {
            wrapper.eq(ComponentDO::getCategory, category);
        }
        if (StringUtils.isNotBlank(search)) {
            wrapper.and(w -> w.like(ComponentDO::getName, search)
                    .or().like(ComponentDO::getDescription, search));
        }
        wrapper.orderByDesc(ComponentDO::getCreatedAt);
        return ComponentConverter.toDomainList(componentMapper.selectList(wrapper));
    }

    @Override
    public boolean existsByProjectIdAndSlug(Long projectId, String slug) {
        LambdaQueryWrapper<ComponentDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ComponentDO::getProjectId, projectId)
               .eq(ComponentDO::getSlug, slug);
        return componentMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void deleteById(Long id) {
        componentMapper.deleteById(id);
    }
}
