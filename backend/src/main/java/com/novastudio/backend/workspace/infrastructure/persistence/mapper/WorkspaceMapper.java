package com.novastudio.backend.workspace.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.workspace.infrastructure.persistence.entity.WorkspaceDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WorkspaceMapper extends BaseMapper<WorkspaceDO> {

    @Select("SELECT w.* FROM workspaces w " +
            "INNER JOIN workspace_members wm ON w.id = wm.workspace_id " +
            "WHERE wm.user_id = #{userId} AND wm.status = 'active' AND w.deleted = 0 AND wm.deleted = 0")
    List<WorkspaceDO> selectByUserId(@Param("userId") Long userId);
}
