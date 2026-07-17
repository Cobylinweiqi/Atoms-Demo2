package com.novastudio.backend.billing.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.novastudio.backend.billing.domain.entity.Subscription;
import com.novastudio.backend.billing.domain.entity.UsageRecord;
import com.novastudio.backend.billing.domain.repository.BillingRepository;
import com.novastudio.backend.billing.infrastructure.persistence.converter.BillingConverter;
import com.novastudio.backend.billing.infrastructure.persistence.entity.SubscriptionDO;
import com.novastudio.backend.billing.infrastructure.persistence.entity.UsageRecordDO;
import com.novastudio.backend.billing.infrastructure.persistence.mapper.SubscriptionMapper;
import com.novastudio.backend.billing.infrastructure.persistence.mapper.UsageRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class BillingRepositoryImpl implements BillingRepository {

    private final SubscriptionMapper subscriptionMapper;
    private final UsageRecordMapper usageRecordMapper;

    @Override
    public Subscription save(Subscription subscription) {
        SubscriptionDO subscriptionDO = BillingConverter.toDO(subscription);
        if (subscriptionDO.getId() == null) {
            subscriptionMapper.insert(subscriptionDO);
        } else {
            subscriptionMapper.updateById(subscriptionDO);
        }
        return BillingConverter.toDomain(subscriptionDO);
    }

    @Override
    public Optional<Subscription> findById(Long id) {
        return Optional.ofNullable(BillingConverter.toDomain(subscriptionMapper.selectById(id)));
    }

    @Override
    public Optional<Subscription> findByWorkspaceId(Long workspaceId) {
        LambdaQueryWrapper<SubscriptionDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubscriptionDO::getWorkspaceId, workspaceId)
               .orderByDesc(SubscriptionDO::getCreatedAt)
               .last("LIMIT 1");
        return Optional.ofNullable(BillingConverter.toDomain(subscriptionMapper.selectOne(wrapper)));
    }

    @Override
    public UsageRecord saveUsageRecord(UsageRecord usageRecord) {
        UsageRecordDO usageRecordDO = BillingConverter.toDO(usageRecord);
        if (usageRecordDO.getId() == null) {
            usageRecordMapper.insert(usageRecordDO);
        } else {
            usageRecordMapper.updateById(usageRecordDO);
        }
        return BillingConverter.toDomain(usageRecordDO);
    }

    @Override
    public List<UsageRecord> findUsageByWorkspaceId(Long workspaceId, String resource,
                                                      LocalDateTime start, LocalDateTime end) {
        LambdaQueryWrapper<UsageRecordDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UsageRecordDO::getWorkspaceId, workspaceId);
        if (StringUtils.isNotBlank(resource)) {
            wrapper.eq(UsageRecordDO::getResource, resource);
        }
        if (start != null) {
            wrapper.ge(UsageRecordDO::getRecordedAt, start);
        }
        if (end != null) {
            wrapper.le(UsageRecordDO::getRecordedAt, end);
        }
        wrapper.orderByDesc(UsageRecordDO::getRecordedAt);
        return BillingConverter.toUsageDomainList(usageRecordMapper.selectList(wrapper));
    }

    @Override
    public long sumUsageByWorkspaceIdAndResource(Long workspaceId, String resource,
                                                   LocalDateTime start, LocalDateTime end) {
        return usageRecordMapper.sumAmount(workspaceId, resource, start, end);
    }
}
