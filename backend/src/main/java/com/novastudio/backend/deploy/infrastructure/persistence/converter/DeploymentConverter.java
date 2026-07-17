package com.novastudio.backend.deploy.infrastructure.persistence.converter;

import com.novastudio.backend.deploy.domain.entity.Deployment;
import com.novastudio.backend.deploy.infrastructure.persistence.entity.DeploymentDO;

import java.util.List;

public class DeploymentConverter {

    private DeploymentConverter() {}

    public static Deployment toDomain(DeploymentDO deploymentDO) {
        if (deploymentDO == null) return null;
        return Deployment.builder()
                .id(deploymentDO.getId())
                .projectId(deploymentDO.getProjectId())
                .platform(deploymentDO.getPlatform())
                .environment(deploymentDO.getEnvironment())
                .url(deploymentDO.getUrl())
                .status(deploymentDO.getStatus())
                .buildLog(deploymentDO.getBuildLog())
                .envVars(deploymentDO.getEnvVars())
                .deployedBy(deploymentDO.getDeployedBy())
                .createdAt(deploymentDO.getCreatedAt())
                .completedAt(deploymentDO.getCompletedAt())
                .build();
    }

    public static DeploymentDO toDO(Deployment deployment) {
        if (deployment == null) return null;
        DeploymentDO deploymentDO = new DeploymentDO();
        deploymentDO.setId(deployment.getId());
        deploymentDO.setProjectId(deployment.getProjectId());
        deploymentDO.setPlatform(deployment.getPlatform());
        deploymentDO.setEnvironment(deployment.getEnvironment());
        deploymentDO.setUrl(deployment.getUrl());
        deploymentDO.setStatus(deployment.getStatus());
        deploymentDO.setBuildLog(deployment.getBuildLog());
        deploymentDO.setEnvVars(deployment.getEnvVars());
        deploymentDO.setDeployedBy(deployment.getDeployedBy());
        deploymentDO.setCreatedAt(deployment.getCreatedAt());
        deploymentDO.setCompletedAt(deployment.getCompletedAt());
        return deploymentDO;
    }

    public static List<Deployment> toDomainList(List<DeploymentDO> deploymentDOs) {
        return deploymentDOs.stream().map(DeploymentConverter::toDomain).toList();
    }
}
