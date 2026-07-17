package com.novastudio.backend.billing.domain.service;

import com.novastudio.backend.billing.domain.entity.Subscription;
import com.novastudio.backend.billing.domain.repository.BillingRepository;
import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BillingDomainService {

    private final BillingRepository billingRepository;

    public Subscription findById(Long id) {
        return billingRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.BILLING_NOT_FOUND));
    }

    public Subscription findByWorkspaceId(Long workspaceId) {
        return billingRepository.findByWorkspaceId(workspaceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.BILLING_NOT_FOUND));
    }

    public void checkQuota(Long workspaceId, String resource, int limit) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        long currentUsage = billingRepository.sumUsageByWorkspaceIdAndResource(
                workspaceId, resource, startOfMonth, LocalDateTime.now());
        if (currentUsage + 1 > limit) {
            throw new BusinessException(ErrorCode.BILLING_QUOTA_EXCEEDED,
                    "配额已超限: " + resource + " (当前: " + currentUsage + ", 上限: " + limit + ")");
        }
    }
}
