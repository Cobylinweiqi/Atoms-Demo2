package com.novastudio.backend.billing.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.billing.infrastructure.persistence.entity.SubscriptionDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SubscriptionMapper extends BaseMapper<SubscriptionDO> {
}
