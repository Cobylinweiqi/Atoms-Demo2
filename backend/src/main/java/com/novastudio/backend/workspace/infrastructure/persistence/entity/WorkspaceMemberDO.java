package com.novastudio.backend.workspace.infrastructure.persistence.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.novastudio.backend.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("workspace_members")
public class WorkspaceMemberDO extends BaseEntity {
    private Long workspaceId;
    private Long userId;
    private String role;
    private String status;
    private String invitedEmail;
    private Long invitedBy;
    private LocalDateTime joinedAt;
}
