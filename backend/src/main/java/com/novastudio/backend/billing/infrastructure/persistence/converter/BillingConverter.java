package com.novastudio.backend.billing.infrastructure.persistence.converter;

import com.novastudio.backend.billing.domain.entity.Subscription;
import com.novastudio.backend.billing.domain.entity.UsageRecord;
import com.novastudio.backend.billing.infrastructure.persistence.entity.SubscriptionDO;
import com.novastudio.backend.billing.infrastructure.persistence.entity.UsageRecordDO;

import java.util.List;

public class BillingConverter {

    private BillingConverter() {}

    public static Subscription toDomain(SubscriptionDO subscriptionDO) {
        if (subscriptionDO == null) return null;
        return Subscription.builder()
                .id(subscriptionDO.getId())
                .workspaceId(subscriptionDO.getWorkspaceId())
                .plan(subscriptionDO.getPlan())
                .status(subscriptionDO.getStatus())
                .stripeCustomerId(subscriptionDO.getStripeCustomerId())
                .stripeSubscriptionId(subscriptionDO.getStripeSubscriptionId())
                .currentPeriodStart(subscriptionDO.getCurrentPeriodStart())
                .currentPeriodEnd(subscriptionDO.getCurrentPeriodEnd())
                .cancelAtPeriodEnd(subscriptionDO.getCancelAtPeriodEnd())
                .createdAt(subscriptionDO.getCreatedAt())
                .updatedAt(subscriptionDO.getUpdatedAt())
                .build();
    }

    public static SubscriptionDO toDO(Subscription subscription) {
        if (subscription == null) return null;
        SubscriptionDO subscriptionDO = new SubscriptionDO();
        subscriptionDO.setId(subscription.getId());
        subscriptionDO.setWorkspaceId(subscription.getWorkspaceId());
        subscriptionDO.setPlan(subscription.getPlan());
        subscriptionDO.setStatus(subscription.getStatus());
        subscriptionDO.setStripeCustomerId(subscription.getStripeCustomerId());
        subscriptionDO.setStripeSubscriptionId(subscription.getStripeSubscriptionId());
        subscriptionDO.setCurrentPeriodStart(subscription.getCurrentPeriodStart());
        subscriptionDO.setCurrentPeriodEnd(subscription.getCurrentPeriodEnd());
        subscriptionDO.setCancelAtPeriodEnd(subscription.getCancelAtPeriodEnd());
        subscriptionDO.setCreatedAt(subscription.getCreatedAt());
        subscriptionDO.setUpdatedAt(subscription.getUpdatedAt());
        return subscriptionDO;
    }

    public static UsageRecord toDomain(UsageRecordDO usageRecordDO) {
        if (usageRecordDO == null) return null;
        return UsageRecord.builder()
                .id(usageRecordDO.getId())
                .workspaceId(usageRecordDO.getWorkspaceId())
                .userId(usageRecordDO.getUserId())
                .resource(usageRecordDO.getResource())
                .amount(usageRecordDO.getAmount())
                .model(usageRecordDO.getModel())
                .metadata(usageRecordDO.getMetadata())
                .recordedAt(usageRecordDO.getRecordedAt())
                .build();
    }

    public static UsageRecordDO toDO(UsageRecord usageRecord) {
        if (usageRecord == null) return null;
        UsageRecordDO usageRecordDO = new UsageRecordDO();
        usageRecordDO.setId(usageRecord.getId());
        usageRecordDO.setWorkspaceId(usageRecord.getWorkspaceId());
        usageRecordDO.setUserId(usageRecord.getUserId());
        usageRecordDO.setResource(usageRecord.getResource());
        usageRecordDO.setAmount(usageRecord.getAmount());
        usageRecordDO.setModel(usageRecord.getModel());
        usageRecordDO.setMetadata(usageRecord.getMetadata());
        usageRecordDO.setRecordedAt(usageRecord.getRecordedAt());
        return usageRecordDO;
    }

    public static List<UsageRecord> toUsageDomainList(List<UsageRecordDO> usageRecordDOs) {
        return usageRecordDOs.stream().map(BillingConverter::toDomain).toList();
    }
}
