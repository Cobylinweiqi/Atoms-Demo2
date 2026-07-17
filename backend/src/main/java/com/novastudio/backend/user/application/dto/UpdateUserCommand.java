package com.novastudio.backend.user.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserCommand {
    private String name;
    private String avatarUrl;
    private String preferredModel;
    private String locale;
}
