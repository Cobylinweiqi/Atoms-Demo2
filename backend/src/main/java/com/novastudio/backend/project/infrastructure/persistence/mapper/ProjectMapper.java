package com.novastudio.backend.project.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.project.infrastructure.persistence.entity.ProjectDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProjectMapper extends BaseMapper<ProjectDO> {
}
