package com.novastudio.backend.conversation.domain.repository;

import com.novastudio.backend.conversation.domain.entity.Conversation;
import com.novastudio.backend.conversation.domain.entity.Message;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository {

    Conversation save(Conversation conversation);

    Optional<Conversation> findById(Long id);

    List<Conversation> findByProjectId(Long projectId);

    void deleteById(Long id);

    // Message operations
    Message saveMessage(Message message);

    Optional<Message> findMessageById(Long id);

    List<Message> findMessagesByConversationId(Long conversationId, Integer page, Integer pageSize);

    long countMessagesByConversationId(Long conversationId);

    List<Message> findRecentMessages(Long conversationId, int limit);
}
