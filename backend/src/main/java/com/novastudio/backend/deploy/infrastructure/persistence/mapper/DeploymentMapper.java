package com.novastudio.backend.deploy.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.deploy.infrastructure.persistence.entity.DeploymentDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface DeploymentMapper extends BaseMapper<DeploymentDO> {

    @Select("SELECT COUNT(*) FROM deployments WHERE project_id = #{projectId} " +
            "AND status IN ('queued', 'building', 'deploying') AND deleted = 0")
    int countInProgressByProjectId(@Param("projectId") Long projectId);
}
