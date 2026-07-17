package com.novastudio.backend.user.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 用户数据对象 (Data Object)
 * 映射数据库表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("users")
public class UserDO extends BaseEntity {

    private String email;
    private Boolean emailVerified;
    private String name;
    private String avatarUrl;
    private String passwordHash;
    private String githubId;
    private String googleId;
    private String preferredModel;
    private String locale;
    private LocalDateTime lastLoginAt;
}
