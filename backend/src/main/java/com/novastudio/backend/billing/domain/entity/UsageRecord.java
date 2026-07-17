package com.novastudio.backend.billing.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 用量记录领域实体
 */
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UsageRecord {

    private Long id;
    private Long workspaceId;
    private Long userId;
    private String resource;
    private Integer amount;
    private String model;
    private String metadata;
    private LocalDateTime recordedAt;

    public static UsageRecord create(Long workspaceId, Long userId, String resource,
                                      Integer amount, String model) {
        return UsageRecord.builder()
                .workspaceId(workspaceId)
                .userId(userId)
                .resource(resource)
                .amount(amount)
                .model(model)
                .recordedAt(LocalDateTime.now())
                .build();
    }

    public void addAmount(int additional) {
        this.amount = (this.amount == null ? 0 : this.amount) + additional;
    }
}
