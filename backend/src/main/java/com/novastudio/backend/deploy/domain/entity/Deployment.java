package com.novastudio.backend.deploy.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Deployment {

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

    public static Deployment create(Long projectId, String platform, String environment,
                                     String envVars, Long deployedBy) {
        return Deployment.builder()
                .projectId(projectId)
                .platform(platform)
                .environment(environment != null ? environment : "preview")
                .status("queued")
                .envVars(envVars)
                .deployedBy(deployedBy)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void startBuilding() {
        this.status = "building";
    }

    public void startDeploying() {
        this.status = "deploying";
    }

    public void goLive(String url, String buildLog) {
        this.status = "live";
        this.url = url;
        this.buildLog = buildLog;
        this.completedAt = LocalDateTime.now();
    }

    public void fail(String buildLog) {
        this.status = "failed";
        this.buildLog = buildLog;
        this.completedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = "cancelled";
        this.completedAt = LocalDateTime.now();
    }

    public boolean isLive() {
        return "live".equals(this.status);
    }

    public boolean isInProgress() {
        return "queued".equals(this.status) || "building".equals(this.status) || "deploying".equals(this.status);
    }

    public void promote() {
        this.environment = "production";
    }
}
