package com.novastudio.backend.deploy.application.assembler;

import com.novastudio.backend.deploy.application.dto.DeploymentDTO;
import com.novastudio.backend.deploy.domain.entity.Deployment;

public class DeploymentAssembler {

    private DeploymentAssembler() {}

    public static DeploymentDTO toDTO(Deployment deployment) {
        if (deployment == null) return null;
        return DeploymentDTO.builder()
                .id(deployment.getId())
                .projectId(deployment.getProjectId())
                .platform(deployment.getPlatform())
                .environment(deployment.getEnvironment())
                .url(deployment.getUrl())
                .status(deployment.getStatus())
                .buildLog(deployment.getBuildLog())
                .envVars(deployment.getEnvVars())
                .deployedBy(deployment.getDeployedBy())
                .createdAt(deployment.getCreatedAt())
                .completedAt(deployment.getCompletedAt())
                .build();
    }
}
