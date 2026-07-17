package com.novastudio.backend.conversation.infrastructure.persistence.converter;

import com.novastudio.backend.conversation.domain.entity.Conversation;
import com.novastudio.backend.conversation.domain.entity.Message;
import com.novastudio.backend.conversation.infrastructure.persistence.entity.ConversationDO;
import com.novastudio.backend.conversation.infrastructure.persistence.entity.MessageDO;

import java.util.List;

public class ConversationConverter {

    private ConversationConverter() {}

    public static Conversation toDomain(ConversationDO conversationDO) {
        if (conversationDO == null) return null;
        return Conversation.builder()
                .id(conversationDO.getId())
                .projectId(conversationDO.getProjectId())
                .userId(conversationDO.getUserId())
                .title(conversationDO.getTitle())
                .model(conversationDO.getModel())
                .createdAt(conversationDO.getCreatedAt())
                .updatedAt(conversationDO.getUpdatedAt())
                .build();
    }

    public static ConversationDO toDO(Conversation conversation) {
        if (conversation == null) return null;
        ConversationDO conversationDO = new ConversationDO();
        conversationDO.setId(conversation.getId());
        conversationDO.setProjectId(conversation.getProjectId());
        conversationDO.setUserId(conversation.getUserId());
        conversationDO.setTitle(conversation.getTitle());
        conversationDO.setModel(conversation.getModel());
        conversationDO.setCreatedAt(conversation.getCreatedAt());
        conversationDO.setUpdatedAt(conversation.getUpdatedAt());
        return conversationDO;
    }

    public static List<Conversation> toDomainList(List<ConversationDO> conversationDOs) {
        return conversationDOs.stream().map(ConversationConverter::toDomain).toList();
    }

    public static Message toDomain(MessageDO messageDO) {
        if (messageDO == null) return null;
        return Message.builder()
                .id(messageDO.getId())
                .conversationId(messageDO.getConversationId())
                .role(messageDO.getRole())
                .content(messageDO.getContent())
                .toolCalls(messageDO.getToolCalls())
                .toolResults(messageDO.getToolResults())
                .model(messageDO.getModel())
                .promptTokens(messageDO.getPromptTokens())
                .completionTokens(messageDO.getCompletionTokens())
                .totalTokens(messageDO.getTotalTokens())
                .costUsd(messageDO.getCostUsd())
                .createdAt(messageDO.getCreatedAt())
                .build();
    }

    public static MessageDO toDO(Message message) {
        if (message == null) return null;
        MessageDO messageDO = new MessageDO();
        messageDO.setId(message.getId());
        messageDO.setConversationId(message.getConversationId());
        messageDO.setRole(message.getRole());
        messageDO.setContent(message.getContent());
        messageDO.setToolCalls(message.getToolCalls());
        messageDO.setToolResults(message.getToolResults());
        messageDO.setModel(message.getModel());
        messageDO.setPromptTokens(message.getPromptTokens());
        messageDO.setCompletionTokens(message.getCompletionTokens());
        messageDO.setTotalTokens(message.getTotalTokens());
        messageDO.setCostUsd(message.getCostUsd());
        messageDO.setCreatedAt(message.getCreatedAt());
        return messageDO;
    }

    public static List<Message> toMessageDomainList(List<MessageDO> messageDOs) {
        return messageDOs.stream().map(ConversationConverter::toDomain).toList();
    }
}
