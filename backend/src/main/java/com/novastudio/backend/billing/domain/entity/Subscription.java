package com.novastudio.backend.billing.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 订阅领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Subscription {

    private Long id;
    private Long workspaceId;
    private String plan;
    private String status;
    private String stripeCustomerId;
    private String stripeSubscriptionId;
    private LocalDateTime currentPeriodStart;
    private LocalDateTime currentPeriodEnd;
    private Boolean cancelAtPeriodEnd;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Subscription create(Long workspaceId, String plan) {
        return Subscription.builder()
                .workspaceId(workspaceId)
                .plan(plan)
                .status("active")
                .cancelAtPeriodEnd(false)
                .currentPeriodStart(LocalDateTime.now())
                .currentPeriodEnd(LocalDateTime.now().plusMonths(1))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void upgrade(String newPlan, String stripeCustomerId, String stripeSubscriptionId,
                        LocalDateTime periodStart, LocalDateTime periodEnd) {
        this.plan = newPlan;
        this.status = "active";
        this.stripeCustomerId = stripeCustomerId;
        this.stripeSubscriptionId = stripeSubscriptionId;
        this.currentPeriodStart = periodStart;
        this.currentPeriodEnd = periodEnd;
        this.cancelAtPeriodEnd = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.cancelAtPeriodEnd = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void cancelImmediately() {
        this.status = "canceled";
        this.plan = "free";
        this.updatedAt = LocalDateTime.now();
    }

    public void markPastDue() {
        this.status = "past_due";
        this.updatedAt = LocalDateTime.now();
    }

    public void renew(LocalDateTime periodStart, LocalDateTime periodEnd) {
        this.status = "active";
        this.currentPeriodStart = periodStart;
        this.currentPeriodEnd = periodEnd;
        this.cancelAtPeriodEnd = false;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return "active".equals(this.status);
    }

    public boolean isFreePlan() {
        return "free".equals(this.plan);
    }
}
