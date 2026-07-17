package com.novastudio.backend.deploy.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeploymentDTO {
    private Long id;
    private Long projectId;
    private String platform;
    private String environment;
    private String url;
    private String status;
    private String buildLog;
    private String envVars;
    private Long deployedBy;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
