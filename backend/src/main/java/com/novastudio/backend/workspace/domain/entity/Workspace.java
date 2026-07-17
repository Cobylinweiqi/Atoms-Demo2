package com.novastudio.backend.workspace.domain.entity;

import com.novastudio.backend.common.enums.PlanType;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 工作空间（组织）领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Workspace {

    private Long id;
    private String name;
    private String slug;
    private Long ownerId;
    private String plan;
    private String logoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Workspace create(String name, String slug, Long ownerId) {
        return Workspace.builder()
                .name(name)
                .slug(slug)
                .ownerId(ownerId)
                .plan(PlanType.FREE.getValue())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void update(String name, String logoUrl) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (logoUrl != null) {
            this.logoUrl = logoUrl;
        }
        this.updatedAt = LocalDateTime.now();
    }

    public void upgradePlan(String newPlan) {
        this.plan = newPlan;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isOwner(Long userId) {
        return this.ownerId.equals(userId);
    }
}
