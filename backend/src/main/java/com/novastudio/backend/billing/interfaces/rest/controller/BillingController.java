package com.novastudio.backend.billing.interfaces.rest.controller;

import com.novastudio.backend.billing.application.dto.BillingDTO.*;
import com.novastudio.backend.billing.application.service.BillingApplicationService;
import com.novastudio.backend.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Tag(name = "账单", description = "订阅与账单管理接口")
@RestController
@RequestMapping("/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingApplicationService billingApplicationService;

    @Operation(summary = "创建/升级订阅")
    @PostMapping("/subscribe")
    public ApiResponse<SubscriptionDTO> subscribe(@Valid @RequestBody SubscribeCommand command) {
        return ApiResponse.success(billingApplicationService.subscribe(command));
    }

    @Operation(summary = "取消订阅")
    @PostMapping("/cancel")
    public ApiResponse<Void> cancel(@RequestParam Long workspaceId) {
        billingApplicationService.cancel(workspaceId);
        return ApiResponse.success(null, "取消成功");
    }

    @Operation(summary = "获取订阅信息")
    @GetMapping
    public ApiResponse<SubscriptionDTO> findSubscription(@RequestParam Long workspaceId) {
        return ApiResponse.success(billingApplicationService.findSubscription(workspaceId));
    }

    @Operation(summary = "获取账单概览")
    @GetMapping("/overview")
    public ApiResponse<BillingOverviewDTO> getBillingOverview(@RequestParam Long workspaceId) {
        return ApiResponse.success(billingApplicationService.getBillingOverview(workspaceId));
    }

    @Operation(summary = "获取用量记录")
    @GetMapping("/usage")
    public ApiResponse<List<UsageDTO>> findUsage(
            @RequestParam Long workspaceId,
            @RequestParam(required = false) String resource,
            @RequestParam(required = false) LocalDateTime start,
            @RequestParam(required = false) LocalDateTime end) {
        return ApiResponse.success(billingApplicationService.findUsage(workspaceId, resource, start, end));
    }

    @Operation(summary = "记录用量")
    @PostMapping("/usage")
    public ApiResponse<Void> recordUsage(@Valid @RequestBody RecordUsageCommand command) {
        billingApplicationService.recordUsage(command);
        return ApiResponse.success(null, "记录成功");
    }

    @Operation(summary = "Stripe Webhook")
    @PostMapping("/webhooks/stripe")
    public ApiResponse<Void> stripeWebhook(@RequestBody String payload,
                                            @RequestHeader(value = "Stripe-Signature", required = false) String signature) {
        // In real implementation, would verify signature and parse event
        billingApplicationService.handleStripeWebhook("invoice.payment_succeeded", null, null);
        return ApiResponse.success(null);
    }
}
