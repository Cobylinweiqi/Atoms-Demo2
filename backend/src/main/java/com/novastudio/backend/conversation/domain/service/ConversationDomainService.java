package com.novastudio.backend.conversation.domain.service;

import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.conversation.domain.entity.Conversation;
import com.novastudio.backend.conversation.domain.entity.Message;
import com.novastudio.backend.conversation.domain.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationDomainService {

    private final ConversationRepository conversationRepository;

    public Conversation findById(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CONVERSATION_NOT_FOUND));
    }

    public List<Message> getRecentMessages(Long conversationId, int limit) {
        return conversationRepository.findRecentMessages(conversationId, limit);
    }

    public void ensureOwnedBy(Conversation conversation, Long userId) {
        if (!conversation.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "无权访问此对话");
        }
    }
}
