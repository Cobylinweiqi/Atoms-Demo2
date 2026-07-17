package com.novastudio.backend.conversation.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.novastudio.backend.conversation.domain.entity.Conversation;
import com.novastudio.backend.conversation.domain.entity.Message;
import com.novastudio.backend.conversation.domain.repository.ConversationRepository;
import com.novastudio.backend.conversation.infrastructure.persistence.converter.ConversationConverter;
import com.novastudio.backend.conversation.infrastructure.persistence.entity.ConversationDO;
import com.novastudio.backend.conversation.infrastructure.persistence.entity.MessageDO;
import com.novastudio.backend.conversation.infrastructure.persistence.mapper.ConversationMapper;
import com.novastudio.backend.conversation.infrastructure.persistence.mapper.MessageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ConversationRepositoryImpl implements ConversationRepository {

    private final ConversationMapper conversationMapper;
    private final MessageMapper messageMapper;

    @Override
    public Conversation save(Conversation conversation) {
        ConversationDO conversationDO = ConversationConverter.toDO(conversation);
        if (conversationDO.getId() == null) {
            conversationMapper.insert(conversationDO);
        } else {
            conversationMapper.updateById(conversationDO);
        }
        return ConversationConverter.toDomain(conversationDO);
    }

    @Override
    public Optional<Conversation> findById(Long id) {
        return Optional.ofNullable(ConversationConverter.toDomain(conversationMapper.selectById(id)));
    }

    @Override
    public List<Conversation> findByProjectId(Long projectId) {
        LambdaQueryWrapper<ConversationDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ConversationDO::getProjectId, projectId)
               .orderByDesc(ConversationDO::getUpdatedAt);
        return ConversationConverter.toDomainList(conversationMapper.selectList(wrapper));
    }

    @Override
    public void deleteById(Long id) {
        conversationMapper.deleteById(id);
    }

    @Override
    public Message saveMessage(Message message) {
        MessageDO messageDO = ConversationConverter.toDO(message);
        if (messageDO.getId() == null) {
            messageMapper.insert(messageDO);
        } else {
            messageMapper.updateById(messageDO);
        }
        return ConversationConverter.toDomain(messageDO);
    }

    @Override
    public Optional<Message> findMessageById(Long id) {
        return Optional.ofNullable(ConversationConverter.toDomain(messageMapper.selectById(id)));
    }

    @Override
    public List<Message> findMessagesByConversationId(Long conversationId, Integer page, Integer pageSize) {
        Page<MessageDO> pageObj = new Page<>(page, pageSize);
        LambdaQueryWrapper<MessageDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MessageDO::getConversationId, conversationId)
               .orderByAsc(MessageDO::getCreatedAt);
        Page<MessageDO> result = messageMapper.selectPage(pageObj, wrapper);
        return ConversationConverter.toMessageDomainList(result.getRecords());
    }

    @Override
    public long countMessagesByConversationId(Long conversationId) {
        LambdaQueryWrapper<MessageDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(MessageDO::getConversationId, conversationId);
        return messageMapper.selectCount(wrapper);
    }

    @Override
    public List<Message> findRecentMessages(Long conversationId, int limit) {
        List<MessageDO> messageDOs = messageMapper.selectRecentMessages(conversationId, limit);
        return ConversationConverter.toMessageDomainList(messageDOs);
    }
}
