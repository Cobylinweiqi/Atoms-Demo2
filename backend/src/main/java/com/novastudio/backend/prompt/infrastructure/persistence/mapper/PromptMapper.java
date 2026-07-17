package com.novastudio.backend.prompt.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.prompt.infrastructure.persistence.entity.PromptDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PromptMapper extends BaseMapper<PromptDO> {
}
