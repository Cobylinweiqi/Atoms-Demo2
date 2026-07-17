package com.novastudio.backend.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PlanType {
    FREE("free", 0, 3, 100),
    PRO("pro", 20, Integer.MAX_VALUE, 1000),
    TEAM("team", 40, Integer.MAX_VALUE, 3000),
    ENTERPRISE("enterprise", -1, Integer.MAX_VALUE, Integer.MAX_VALUE);

    private final String value;
    private final int pricePerMonth;
    private final int maxProjects;
    private final int maxMessagesPerDay;
}
