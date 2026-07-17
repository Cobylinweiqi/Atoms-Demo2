package com.novastudio.backend.workspace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDTO {
    private Long id;
    private String name;
    private String slug;
    private Long ownerId;
    private String plan;
    private String logoUrl;
    private String currentUserRole;
    private LocalDateTime createdAt;
}
