package com.novastudio.backend.user.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.user.infrastructure.persistence.entity.UserDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper extends BaseMapper<UserDO> {

    UserDO selectByEmail(@Param("email") String email);

    UserDO selectByGithubId(@Param("githubId") String githubId);

    UserDO selectByGoogleId(@Param("googleId") String googleId);

    int updateLastLoginAt(@Param("id") Long id, @Param("lastLoginAt") java.time.LocalDateTime lastLoginAt);
}
