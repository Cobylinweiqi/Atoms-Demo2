package com.novastudio.backend.deploy.application.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.common.security.SecurityUtils;
import com.novastudio.backend.deploy.application.assembler.DeploymentAssembler;
import com.novastudio.backend.deploy.application.dto.DeployCommands.*;
import com.novastudio.backend.deploy.application.dto.DeploymentDTO;
import com.novastudio.backend.deploy.domain.entity.Deployment;
import com.novastudio.backend.deploy.domain.repository.DeploymentRepository;
import com.novastudio.backend.deploy.domain.service.DeploymentDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DeployApplicationService {

    private final DeploymentRepository deploymentRepository;
    private final DeploymentDomainService deploymentDomainService;

    @Transactional
    public DeploymentDTO create(CreateDeploymentCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        // Ensure no deployment in progress
        deploymentDomainService.ensureNoInProgress(command.getProjectId());

        Deployment deployment = Deployment.create(command.getProjectId(), command.getPlatform(),
                command.getEnvironment(), command.getEnvVars(), currentUserId);
        deployment = deploymentRepository.save(deployment);

        // Simulate async deployment
        deployment.startBuilding();
        deploymentRepository.save(deployment);

        try {
            // In real implementation, this would trigger sandbox build + platform deploy
            Thread.sleep(100);

            String deployUrl = "https://" + command.getProjectId() + ".nova-studio.app";
            deployment.goLive(deployUrl, "Build completed successfully");
        } catch (Exception e) {
            deployment.fail("Build failed: " + e.getMessage());
        }
        deployment = deploymentRepository.save(deployment);

        log.info("Deployment created: id={}, projectId={}, status={}",
                deployment.getId(), deployment.getProjectId(), deployment.getStatus());
        return DeploymentAssembler.toDTO(deployment);
    }

    public DeploymentDTO findById(Long id) {
        return DeploymentAssembler.toDTO(deploymentDomainService.findById(id));
    }

    public List<DeploymentDTO> findByProjectId(Long projectId) {
        return deploymentRepository.findByProjectId(projectId).stream()
                .map(DeploymentAssembler::toDTO)
                .toList();
    }

    public String getBuildLog(Long id) {
        Deployment deployment = deploymentDomainService.findById(id);
        return deployment.getBuildLog();
    }

    @Transactional
    public void cancel(Long id) {
        Deployment deployment = deploymentDomainService.findById(id);
        if (!deployment.isInProgress()) {
            throw new BusinessException(ErrorCode.DEPLOY_FAILED, "只能取消进行中的部署");
        }
        deployment.cancel();
        deploymentRepository.save(deployment);
        log.info("Deployment cancelled: id={}", id);
    }

    @Transactional
    public DeploymentDTO promote(Long id) {
        Deployment deployment = deploymentDomainService.findById(id);
        if (!deployment.isLive()) {
            throw new BusinessException(ErrorCode.DEPLOY_FAILED, "只能提升已上线的部署");
        }
        deployment.promote();
        deployment = deploymentRepository.save(deployment);
        log.info("Deployment promoted to production: id={}", id);
        return DeploymentAssembler.toDTO(deployment);
    }
}
