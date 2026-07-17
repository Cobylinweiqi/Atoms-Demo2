package com.novastudio.backend.conversation.application.assembler;

import com.novastudio.backend.conversation.application.dto.ConversationDTO;
import com.novastudio.backend.conversation.application.dto.MessageDTO;
import com.novastudio.backend.conversation.domain.entity.Conversation;
import com.novastudio.backend.conversation.domain.entity.Message;

public class ConversationAssembler {

    private ConversationAssembler() {}

    public static ConversationDTO toDTO(Conversation conversation) {
        if (conversation == null) return null;
        return ConversationDTO.builder()
                .id(conversation.getId())
                .projectId(conversation.getProjectId())
                .userId(conversation.getUserId())
                .title(conversation.getTitle())
                .model(conversation.getModel())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }

    public static MessageDTO toMessageDTO(Message message) {
        if (message == null) return null;
        return MessageDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .role(message.getRole())
                .content(message.getContent())
                .toolCalls(message.getToolCalls())
                .toolResults(message.getToolResults())
                .model(message.getModel())
                .promptTokens(message.getPromptTokens())
                .completionTokens(message.getCompletionTokens())
                .totalTokens(message.getTotalTokens())
                .costUsd(message.getCostUsd())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
