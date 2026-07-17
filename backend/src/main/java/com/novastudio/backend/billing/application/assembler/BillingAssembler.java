package com.novastudio.backend.billing.application.assembler;

import com.novastudio.backend.billing.application.dto.BillingDTO.*;
import com.novastudio.backend.billing.domain.entity.Subscription;
import com.novastudio.backend.billing.domain.entity.UsageRecord;

public class BillingAssembler {

    private BillingAssembler() {}

    public static SubscriptionDTO toDTO(Subscription subscription) {
        if (subscription == null) return null;
        return SubscriptionDTO.builder()
                .id(subscription.getId())
                .workspaceId(subscription.getWorkspaceId())
                .plan(subscription.getPlan())
                .status(subscription.getStatus())
                .stripeCustomerId(subscription.getStripeCustomerId())
                .stripeSubscriptionId(subscription.getStripeSubscriptionId())
                .currentPeriodStart(subscription.getCurrentPeriodStart())
                .currentPeriodEnd(subscription.getCurrentPeriodEnd())
                .cancelAtPeriodEnd(subscription.getCancelAtPeriodEnd())
                .createdAt(subscription.getCreatedAt())
                .build();
    }

    public static UsageDTO toUsageDTO(UsageRecord usageRecord) {
        if (usageRecord == null) return null;
        return UsageDTO.builder()
                .id(usageRecord.getId())
                .workspaceId(usageRecord.getWorkspaceId())
                .userId(usageRecord.getUserId())
                .resource(usageRecord.getResource())
                .amount(usageRecord.getAmount())
                .model(usageRecord.getModel())
                .recordedAt(usageRecord.getRecordedAt())
                .build();
    }
}
