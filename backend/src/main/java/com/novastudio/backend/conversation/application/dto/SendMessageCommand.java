package com.novastudio.backend.conversation.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageCommand {
    @NotBlank(message = "消息内容不能为空")
    private String content;
    private String model;
    private String attachments;
    private String context;
}
