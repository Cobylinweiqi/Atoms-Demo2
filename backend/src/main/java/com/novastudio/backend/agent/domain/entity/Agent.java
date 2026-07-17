package com.novastudio.backend.agent.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Agent {

    private Long id;
    private Long projectId;
    private String name;
    private String description;
    private String nodes;
    private String edges;
    private String triggerType;
    private String triggerConfig;
    private String status;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Agent create(Long projectId, String name, String description,
                                String triggerType, Long createdBy) {
        return Agent.builder()
                .projectId(projectId)
                .name(name)
                .description(description)
                .triggerType(triggerType != null ? triggerType : "manual")
                .status("draft")
                .createdBy(createdBy)
                .nodes("[]")
                .edges("[]")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String description, String triggerType, String triggerConfig) {
        if (name != null && !name.isBlank()) this.name = name;
        if (description != null) this.description = description;
        if (triggerType != null && !triggerType.isBlank()) this.triggerType = triggerType;
        if (triggerConfig != null) this.triggerConfig = triggerConfig;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateFlow(String nodes, String edges) {
        this.nodes = nodes;
        this.edges = edges;
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.status = "active";
        this.updatedAt = LocalDateTime.now();
    }

    public void pause() {
        this.status = "paused";
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return "active".equals(this.status);
    }
}
