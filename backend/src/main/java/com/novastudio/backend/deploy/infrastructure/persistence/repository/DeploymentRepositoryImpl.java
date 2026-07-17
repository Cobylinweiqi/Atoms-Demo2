package com.novastudio.backend.deploy.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.deploy.domain.entity.Deployment;
import com.novastudio.backend.deploy.domain.repository.DeploymentRepository;
import com.novastudio.backend.deploy.infrastructure.persistence.converter.DeploymentConverter;
import com.novastudio.backend.deploy.infrastructure.persistence.entity.DeploymentDO;
import com.novastudio.backend.deploy.infrastructure.persistence.mapper.DeploymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DeploymentRepositoryImpl implements DeploymentRepository {

    private final DeploymentMapper deploymentMapper;

    @Override
    public Deployment save(Deployment deployment) {
        DeploymentDO deploymentDO = DeploymentConverter.toDO(deployment);
        if (deploymentDO.getId() == null) {
            deploymentMapper.insert(deploymentDO);
        } else {
            deploymentMapper.updateById(deploymentDO);
        }
        return DeploymentConverter.toDomain(deploymentDO);
    }

    @Override
    public Optional<Deployment> findById(Long id) {
        return Optional.ofNullable(DeploymentConverter.toDomain(deploymentMapper.selectById(id)));
    }

    @Override
    public List<Deployment> findByProjectId(Long projectId) {
        LambdaQueryWrapper<DeploymentDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DeploymentDO::getProjectId, projectId)
               .orderByDesc(DeploymentDO::getCreatedAt);
        return DeploymentConverter.toDomainList(deploymentMapper.selectList(wrapper));
    }

    @Override
    public boolean hasInProgressByProjectId(Long projectId) {
        return deploymentMapper.countInProgressByProjectId(projectId) > 0;
    }
}
