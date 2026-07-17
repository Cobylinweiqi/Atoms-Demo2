package com.novastudio.backend.billing.application.service;

import com.novastudio.backend.billing.application.assembler.BillingAssembler;
import com.novastudio.backend.billing.application.dto.BillingDTO.*;
import com.novastudio.backend.billing.domain.entity.Subscription;
import com.novastudio.backend.billing.domain.entity.UsageRecord;
import com.novastudio.backend.billing.domain.repository.BillingRepository;
import com.novastudio.backend.billing.domain.service.BillingDomainService;
import com.novastudio.backend.common.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingApplicationService {

    private final BillingRepository billingRepository;
    private final BillingDomainService billingDomainService;

    @Transactional
    public SubscriptionDTO subscribe(SubscribeCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        Optional<Subscription> existing = billingRepository.findByWorkspaceId(command.getWorkspaceId());

        Subscription subscription;
        if (existing.isPresent()) {
            subscription = existing.get();
            // In real implementation, would call Stripe API here
            subscription.upgrade(command.getPlan(), "stripe_customer_" + currentUserId,
                    "stripe_sub_" + System.currentTimeMillis(),
                    LocalDateTime.now(), LocalDateTime.now().plusMonths(1));
        } else {
            subscription = Subscription.create(command.getWorkspaceId(), command.getPlan());
            if (!"free".equals(command.getPlan())) {
                subscription.upgrade(command.getPlan(), "stripe_customer_" + currentUserId,
                        "stripe_sub_" + System.currentTimeMillis(),
                        LocalDateTime.now(), LocalDateTime.now().plusMonths(1));
            }
        }
        subscription = billingRepository.save(subscription);

        log.info("Subscription updated: workspaceId={}, plan={}", command.getWorkspaceId(), command.getPlan());
        return BillingAssembler.toDTO(subscription);
    }

    @Transactional
    public void cancel(Long workspaceId) {
        Subscription subscription = billingDomainService.findByWorkspaceId(workspaceId);
        subscription.cancel();
        billingRepository.save(subscription);
        log.info("Subscription cancelled: workspaceId={}", workspaceId);
    }

    public SubscriptionDTO findSubscription(Long workspaceId) {
        return Optional.ofNullable(billingDomainService.findByWorkspaceId(workspaceId))
                .map(BillingAssembler::toDTO)
                .orElse(null);
    }

    public BillingOverviewDTO getBillingOverview(Long workspaceId) {
        Subscription subscription = billingRepository.findByWorkspaceId(workspaceId).orElse(null);

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();

        List<UsageRecord> usage = billingRepository.findUsageByWorkspaceId(workspaceId, null, startOfMonth, now);

        long totalAiMessages = billingRepository.sumUsageByWorkspaceIdAndResource(workspaceId, "ai_messages", startOfMonth, now);
        long totalAiTokens = billingRepository.sumUsageByWorkspaceIdAndResource(workspaceId, "ai_tokens", startOfMonth, now);
        long totalDeployments = billingRepository.sumUsageByWorkspaceIdAndResource(workspaceId, "deployments", startOfMonth, now);
        long totalBuildMinutes = billingRepository.sumUsageByWorkspaceIdAndResource(workspaceId, "build_minutes", startOfMonth, now);

        return BillingOverviewDTO.builder()
                .subscription(BillingAssembler.toDTO(subscription))
                .usage(usage.stream().map(BillingAssembler::toUsageDTO).toList())
                .totalAiMessages(totalAiMessages)
                .totalAiTokens(totalAiTokens)
                .totalDeployments(totalDeployments)
                .totalBuildMinutes(totalBuildMinutes)
                .build();
    }

    public List<UsageDTO> findUsage(Long workspaceId, String resource, LocalDateTime start, LocalDateTime end) {
        List<UsageRecord> usage = billingRepository.findUsageByWorkspaceId(workspaceId, resource, start, end);
        return usage.stream().map(BillingAssembler::toUsageDTO).toList();
    }

    @Transactional
    public void recordUsage(RecordUsageCommand command) {
        UsageRecord usageRecord = UsageRecord.create(command.getWorkspaceId(), command.getUserId(),
                command.getResource(), command.getAmount(), command.getModel());
        billingRepository.saveUsageRecord(usageRecord);
    }

    @Transactional
    public void handleStripeWebhook(String eventType, String customerId, String subscriptionId) {
        log.info("Stripe webhook received: type={}, customer={}, sub={}", eventType, customerId, subscriptionId);

        // In real implementation, would look up workspace by stripe_customer_id
        // and update subscription accordingly
        switch (eventType) {
            case "invoice.payment_succeeded" -> {
                // Renew subscription
                log.info("Payment succeeded, renewing subscription");
            }
            case "customer.subscription.deleted" -> {
                // Downgrade to free
                log.info("Subscription deleted, downgrading to free");
            }
            case "invoice.payment_failed" -> {
                // Mark as past_due
                log.info("Payment failed, marking as past_due");
            }
            default -> log.info("Unhandled Stripe event: {}", eventType);
        }
    }
}
