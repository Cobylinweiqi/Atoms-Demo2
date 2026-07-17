package com.novastudio.backend.conversation.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Message {

    private Long id;
    private Long conversationId;
    private String role;
    private String content;
    private String toolCalls;
    private String toolResults;
    private String model;
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;
    private java.math.BigDecimal costUsd;
    private LocalDateTime createdAt;

    public static Message createUserMessage(Long conversationId, String content) {
        return Message.builder()
                .conversationId(conversationId)
                .role("user")
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public static Message createAssistantMessage(Long conversationId, String content, String model) {
        return Message.builder()
                .conversationId(conversationId)
                .role("assistant")
                .content(content)
                .model(model)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void updateTokenInfo(Integer promptTokens, Integer completionTokens, java.math.BigDecimal costUsd) {
        this.promptTokens = promptTokens;
        this.completionTokens = completionTokens;
        this.totalTokens = (promptTokens != null ? promptTokens : 0) + (completionTokens != null ? completionTokens : 0);
        this.costUsd = costUsd;
    }

    public void appendContent(String delta) {
        this.content = (this.content == null ? "" : this.content) + delta;
    }
}
