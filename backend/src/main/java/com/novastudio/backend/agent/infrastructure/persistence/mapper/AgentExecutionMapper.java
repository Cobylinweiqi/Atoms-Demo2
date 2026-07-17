package com.novastudio.backend.agent.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.agent.infrastructure.persistence.entity.AgentExecutionDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AgentExecutionMapper extends BaseMapper<AgentExecutionDO> {

    @Select("SELECT * FROM agent_executions WHERE agent_id = #{agentId} AND deleted = 0 " +
            "ORDER BY created_at DESC LIMIT #{limit}")
    List<AgentExecutionDO> selectByAgentId(@Param("agentId") Long agentId, @Param("limit") int limit);
}
