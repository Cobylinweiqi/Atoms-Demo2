package com.novastudio.backend.conversation.infrastructure.persistence.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.novastudio.backend.conversation.infrastructure.persistence.entity.MessageDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<MessageDO> {

    @Select("SELECT * FROM messages WHERE conversation_id = #{conversationId} AND deleted = 0 " +
            "ORDER BY created_at DESC LIMIT #{limit}")
    List<MessageDO> selectRecentMessages(@Param("conversationId") Long conversationId, @Param("limit") int limit);
}
