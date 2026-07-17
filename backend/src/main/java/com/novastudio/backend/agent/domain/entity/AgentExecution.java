package com.novastudio.backend.agent.domain.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AgentExecution {

    private Long id;
    private Long agentId;
    private String status;
    private String input;
    private String output;
    private String error;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;

    public static AgentExecution create(Long agentId, String input) {
        return AgentExecution.builder()
                .agentId(agentId)
                .status("pending")
                .input(input)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void start() {
        this.status = "running";
        this.startedAt = LocalDateTime.now();
    }

    public void complete(String output) {
        this.status = "completed";
        this.output = output;
        this.completedAt = LocalDateTime.now();
    }

    public void fail(String error) {
        this.status = "failed";
        this.error = error;
        this.completedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = "cancelled";
        this.completedAt = LocalDateTime.now();
    }
}
