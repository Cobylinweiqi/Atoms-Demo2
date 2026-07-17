package com.novastudio.backend.conversation.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationCommand {
    @NotNull(message = "项目ID不能为空")
    private Long projectId;

    private String title;
    private String model;
}
