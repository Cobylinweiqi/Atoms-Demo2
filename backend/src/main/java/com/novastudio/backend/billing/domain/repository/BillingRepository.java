package com.novastudio.backend.billing.domain.repository;

import com.novastudio.backend.billing.domain.entity.Subscription;
import com.novastudio.backend.billing.domain.entity.UsageRecord;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BillingRepository {

    Subscription save(Subscription subscription);

    Optional<Subscription> findById(Long id);

    Optional<Subscription> findByWorkspaceId(Long workspaceId);

    UsageRecord saveUsageRecord(UsageRecord usageRecord);

    List<UsageRecord> findUsageByWorkspaceId(Long workspaceId, String resource, LocalDateTime start, LocalDateTime end);

    long sumUsageByWorkspaceIdAndResource(Long workspaceId, String resource, LocalDateTime start, LocalDateTime end);
}
