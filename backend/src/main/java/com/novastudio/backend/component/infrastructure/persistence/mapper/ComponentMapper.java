package com.novastudio.backend.component.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.component.infrastructure.persistence.entity.ComponentDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ComponentMapper extends BaseMapper<ComponentDO> {
}
