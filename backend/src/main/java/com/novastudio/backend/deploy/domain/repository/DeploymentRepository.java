package com.novastudio.backend.deploy.domain.repository;

import com.novastudio.backend.deploy.domain.entity.Deployment;

import java.util.List;
import java.util.Optional;

public interface DeploymentRepository {

    Deployment save(Deployment deployment);

    Optional<Deployment> findById(Long id);

    List<Deployment> findByProjectId(Long projectId);

    boolean hasInProgressByProjectId(Long projectId);
}
