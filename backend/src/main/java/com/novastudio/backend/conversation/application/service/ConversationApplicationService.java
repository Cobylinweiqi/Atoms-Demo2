package com.novastudio.backend.conversation.application.service;

import com.novastudio.backend.common.response.PageResponse;
import com.novastudio.backend.common.security.SecurityUtils;
import com.novastudio.backend.conversation.application.assembler.ConversationAssembler;
import com.novastudio.backend.conversation.application.dto.*;
import com.novastudio.backend.conversation.domain.entity.Conversation;
import com.novastudio.backend.conversation.domain.entity.Message;
import com.novastudio.backend.conversation.domain.repository.ConversationRepository;
import com.novastudio.backend.conversation.domain.service.ConversationDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationApplicationService {

    private final ConversationRepository conversationRepository;
    private final ConversationDomainService conversationDomainService;

    @Transactional
    public ConversationDTO create(CreateConversationCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();

        Conversation conversation = Conversation.create(command.getProjectId(), currentUserId,
                command.getTitle(), command.getModel());
        conversation = conversationRepository.save(conversation);

        log.info("Conversation created: id={}, projectId={}", conversation.getId(), conversation.getProjectId());
        return ConversationAssembler.toDTO(conversation);
    }

    public ConversationDTO findById(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Conversation conversation = conversationDomainService.findById(id);
        conversationDomainService.ensureOwnedBy(conversation, currentUserId);
        return ConversationAssembler.toDTO(conversation);
    }

    public List<ConversationDTO> findByProjectId(Long projectId) {
        return conversationRepository.findByProjectId(projectId).stream()
                .map(ConversationAssembler::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Conversation conversation = conversationDomainService.findById(id);
        conversationDomainService.ensureOwnedBy(conversation, currentUserId);
        conversationRepository.deleteById(id);
        log.info("Conversation deleted: id={}", id);
    }

    @Transactional
    public ConversationDTO updateTitle(Long id, String title) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Conversation conversation = conversationDomainService.findById(id);
        conversationDomainService.ensureOwnedBy(conversation, currentUserId);

        conversation.updateTitle(title);
        conversation = conversationRepository.save(conversation);
        return ConversationAssembler.toDTO(conversation);
    }

    @Transactional
    public MessageDTO sendMessage(Long conversationId, SendMessageCommand command) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Conversation conversation = conversationDomainService.findById(conversationId);
        conversationDomainService.ensureOwnedBy(conversation, currentUserId);

        // 保存用户消息
        Message userMessage = Message.createUserMessage(conversationId, command.getContent());
        userMessage = conversationRepository.saveMessage(userMessage);

        // 保存AI回复（简化：实际应调用AI服务）
        Message assistantMessage = Message.createAssistantMessage(conversationId,
                "收到您的消息，正在处理中...", command.getModel());
        assistantMessage = conversationRepository.saveMessage(assistantMessage);

        // 更新对话
        conversation.updateModel(command.getModel());
        conversationRepository.save(conversation);

        log.info("Message sent: conversationId={}, role=user", conversationId);
        return ConversationAssembler.toMessageDTO(assistantMessage);
    }

    public PageResponse<MessageDTO> findMessages(Long conversationId, Integer page, Integer pageSize) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Conversation conversation = conversationDomainService.findById(conversationId);
        conversationDomainService.ensureOwnedBy(conversation, currentUserId);

        List<Message> messages = conversationRepository.findMessagesByConversationId(conversationId, page, pageSize);
        long total = conversationRepository.countMessagesByConversationId(conversationId);

        List<MessageDTO> messageDTOs = messages.stream()
                .map(ConversationAssembler::toMessageDTO)
                .toList();

        return PageResponse.of(messageDTOs, total, page, pageSize);
    }

    public List<MessageDTO> findRecentMessages(Long conversationId, int limit) {
        List<Message> messages = conversationDomainService.getRecentMessages(conversationId, limit);
        return messages.stream()
                .map(ConversationAssembler::toMessageDTO)
                .toList();
    }
}
