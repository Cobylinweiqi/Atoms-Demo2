package com.novastudio.backend.deploy.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.deploy.domain.entity.Deployment;
import com.novastudio.backend.deploy.domain.repository.DeploymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeploymentDomainService {

    private final DeploymentRepository deploymentRepository;

    public Deployment findById(Long id) {
        return deploymentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPLOY_NOT_FOUND));
    }

    public void ensureNoInProgress(Long projectId) {
        if (deploymentRepository.hasInProgressByProjectId(projectId)) {
            throw new BusinessException(ErrorCode.DEPLOY_IN_PROGRESS);
        }
    }
}
