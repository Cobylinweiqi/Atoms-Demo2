package com.novastudio.backend.billing.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("subscriptions")
public class SubscriptionDO extends BaseEntity {
    private Long workspaceId;
    private String plan;
    private String status;
    private String stripeCustomerId;
    private String stripeSubscriptionId;
    private LocalDateTime currentPeriodStart;
    private LocalDateTime currentPeriodEnd;
    private Boolean cancelAtPeriodEnd;
}
