package com.novastudio.backend.workspace.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.workspace.infrastructure.persistence.entity.WorkspaceMemberDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WorkspaceMemberMapper extends BaseMapper<WorkspaceMemberDO> {
}
