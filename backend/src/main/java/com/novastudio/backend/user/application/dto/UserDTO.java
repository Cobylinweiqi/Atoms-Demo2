package com.novastudio.backend.user.application.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    private Long id;
    private String email;
    private Boolean emailVerified;
    private String name;
    private String avatarUrl;
    private String preferredModel;
    private String locale;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
