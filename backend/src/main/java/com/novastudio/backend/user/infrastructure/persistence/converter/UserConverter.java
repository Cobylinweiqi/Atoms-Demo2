package com.novastudio.backend.user.infrastructure.persistence.converter;

import com.novastudio.backend.user.domain.entity.User;
import com.novastudio.backend.user.infrastructure.persistence.entity.UserDO;

/**
 * 用户领域实体与数据对象之间的转换器
 */
public class UserConverter {

    private UserConverter() {}

    public static User toDomain(UserDO userDO) {
        if (userDO == null) {
            return null;
        }
        return User.builder()
                .id(userDO.getId())
                .email(userDO.getEmail())
                .emailVerified(userDO.getEmailVerified())
                .name(userDO.getName())
                .avatarUrl(userDO.getAvatarUrl())
                .passwordHash(userDO.getPasswordHash())
                .githubId(userDO.getGithubId())
                .googleId(userDO.getGoogleId())
                .preferredModel(userDO.getPreferredModel())
                .locale(userDO.getLocale())
                .createdAt(userDO.getCreatedAt())
                .updatedAt(userDO.getUpdatedAt())
                .lastLoginAt(userDO.getLastLoginAt())
                .build();
    }

    public static UserDO toDO(User user) {
        if (user == null) {
            return null;
        }
        UserDO userDO = new UserDO();
        userDO.setId(user.getId());
        userDO.setEmail(user.getEmail());
        userDO.setEmailVerified(user.getEmailVerified());
        userDO.setName(user.getName());
        userDO.setAvatarUrl(user.getAvatarUrl());
        userDO.setPasswordHash(user.getPasswordHash());
        userDO.setGithubId(user.getGithubId());
        userDO.setGoogleId(user.getGoogleId());
        userDO.setPreferredModel(user.getPreferredModel());
        userDO.setLocale(user.getLocale());
        userDO.setLastLoginAt(user.getLastLoginAt());
        userDO.setCreatedAt(user.getCreatedAt());
        userDO.setUpdatedAt(user.getUpdatedAt());
        return userDO;
    }
}
