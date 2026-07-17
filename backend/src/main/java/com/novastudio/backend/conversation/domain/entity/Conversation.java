package com.novastudio.backend.conversation.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Conversation {

    private Long id;
    private Long projectId;
    private Long userId;
    private String title;
    private String model;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static Conversation create(Long projectId, Long userId, String title, String model) {
        return Conversation.builder()
                .projectId(projectId)
                .userId(userId)
                .title(title != null ? title : "新对话")
                .model(model != null ? model : "gpt-4o")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public void updateTitle(String title) {
        if (title != null && !title.isBlank()) {
            this.title = title;
            this.updatedAt = LocalDateTime.now();
        }
    }

    public void updateModel(String model) {
        if (model != null && !model.isBlank()) {
            this.model = model;
            this.updatedAt = LocalDateTime.now();
        }
    }
}
