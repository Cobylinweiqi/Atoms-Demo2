package com.novastudio.backend.prompt.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.novastudio.backend.prompt.domain.entity.Prompt;
import com.novastudio.backend.prompt.domain.repository.PromptRepository;
import com.novastudio.backend.prompt.infrastructure.persistence.converter.PromptConverter;
import com.novastudio.backend.prompt.infrastructure.persistence.entity.PromptDO;
import com.novastudio.backend.prompt.infrastructure.persistence.mapper.PromptMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class PromptRepositoryImpl implements PromptRepository {

    private final PromptMapper promptMapper;

    @Override
    public Prompt save(Prompt prompt) {
        PromptDO promptDO = PromptConverter.toDO(prompt);
        if (promptDO.getId() == null) {
            promptMapper.insert(promptDO);
        } else {
            promptMapper.updateById(promptDO);
        }
        return PromptConverter.toDomain(promptDO);
    }

    @Override
    public Optional<Prompt> findById(Long id) {
        return Optional.ofNullable(PromptConverter.toDomain(promptMapper.selectById(id)));
    }

    @Override
    public List<Prompt> findByWorkspaceId(Long workspaceId, String category, String search) {
        LambdaQueryWrapper<PromptDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PromptDO::getWorkspaceId, workspaceId);
        if (StringUtils.isNotBlank(category)) {
            wrapper.eq(PromptDO::getCategory, category);
        }
        if (StringUtils.isNotBlank(search)) {
            wrapper.and(w -> w.like(PromptDO::getName, search)
                    .or().like(PromptDO::getDescription, search));
        }
        wrapper.orderByDesc(PromptDO::getCreatedAt);
        return PromptConverter.toDomainList(promptMapper.selectList(wrapper));
    }

    @Override
    public List<Prompt> findPublicPrompts(String category) {
        LambdaQueryWrapper<PromptDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PromptDO::getIsPublic, true);
        if (StringUtils.isNotBlank(category)) {
            wrapper.eq(PromptDO::getCategory, category);
        }
        wrapper.orderByDesc(PromptDO::getCreatedAt);
        return PromptConverter.toDomainList(promptMapper.selectList(wrapper));
    }

    @Override
    public boolean existsByWorkspaceIdAndName(Long workspaceId, String name) {
        LambdaQueryWrapper<PromptDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PromptDO::getWorkspaceId, workspaceId)
               .eq(PromptDO::getName, name);
        return promptMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void deleteById(Long id) {
        promptMapper.deleteById(id);
    }
}
