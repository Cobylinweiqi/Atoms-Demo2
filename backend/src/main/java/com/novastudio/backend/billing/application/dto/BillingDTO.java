package com.novastudio.backend.billing.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class BillingDTO {

    private BillingDTO() {}

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscriptionDTO {
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
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageDTO {
        private Long id;
        private Long workspaceId;
        private Long userId;
        private String resource;
        private Integer amount;
        private String model;
        private LocalDateTime recordedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingOverviewDTO {
        private SubscriptionDTO subscription;
        private List<UsageDTO> usage;
        private long totalAiMessages;
        private long totalAiTokens;
        private long totalDeployments;
        private long totalBuildMinutes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubscribeCommand {
        private Long workspaceId;
        private String plan;
        private String stripeToken;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecordUsageCommand {
        private Long workspaceId;
        private Long userId;
        private String resource;
        private Integer amount;
        private String model;
    }
}
