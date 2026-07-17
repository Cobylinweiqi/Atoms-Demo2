package com.novastudio.backend.user.application.assembler;

import com.novastudio.backend.user.application.dto.UserDTO;
import com.novastudio.backend.user.domain.entity.User;

public class UserAssembler {

    private UserAssembler() {}

    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .emailVerified(user.getEmailVerified())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .preferredModel(user.getPreferredModel())
                .locale(user.getLocale())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
