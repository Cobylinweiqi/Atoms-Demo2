package com.novastudio.backend.billing.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.billing.infrastructure.persistence.entity.UsageRecordDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
@Mapper
public interface UsageRecordMapper extends BaseMapper<UsageRecordDO> {

    @Select("SELECT COALESCE(SUM(amount), 0) FROM usage_records " +
            "WHERE workspace_id = #{workspaceId} AND resource = #{resource} " +
            "AND recorded_at >= #{start} AND recorded_at <= #{end} AND deleted = 0")
    long sumAmount(@Param("workspaceId") Long workspaceId,
                   @Param("resource") String resource,
                   @Param("start") LocalDateTime start,
                   @Param("end") LocalDateTime end);
}
