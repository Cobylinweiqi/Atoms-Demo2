package com.novastudio.backend.theme.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.theme.infrastructure.persistence.entity.ThemeDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ThemeMapper extends BaseMapper<ThemeDO> {

    @Update("UPDATE theme_configs SET is_active = 0, updated_at = NOW() WHERE project_id = #{projectId} AND deleted = 0")
    int deactivateAllByProjectId(@Param("projectId") Long projectId);
}
