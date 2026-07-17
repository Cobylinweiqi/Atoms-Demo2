package com.novastudio.backend.permission.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionDTO {
    private Long id;
    private String name;
    private String code;
    private String resource;
    private String action;
    private String description;
    private Boolean isSystem;
    private LocalDateTime createdAt;
}
