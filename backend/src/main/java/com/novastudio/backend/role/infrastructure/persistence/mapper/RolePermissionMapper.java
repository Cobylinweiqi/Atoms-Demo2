package com.novastudio.backend.role.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.role.infrastructure.persistence.entity.RolePermissionDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RolePermissionMapper extends BaseMapper<RolePermissionDO> {

    @Select("SELECT permission_id FROM role_permissions WHERE role_id = #{roleId}")
    List<Long> selectPermissionIdsByRoleId(@Param("roleId") Long roleId);

    int batchInsert(@Param("list") List<RolePermissionDO> list);
}
