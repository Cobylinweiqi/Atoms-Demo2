package com.novastudio.backend.common.constant;

public final class RedisConstants {

    private RedisConstants() {}

    // JWT
    public static final String JWT_BLACKLIST_PREFIX = "jwt:blacklist:";
    public static final String REFRESH_TOKEN_PREFIX = "jwt:refresh:";

    // User
    public static final String USER_INFO_PREFIX = "user:info:";
    public static final String USER_PERMISSIONS_PREFIX = "user:permissions:";

    // Workspace
    public static final String WORKSPACE_INFO_PREFIX = "workspace:info:";
    public static final String WORKSPACE_MEMBERS_PREFIX = "workspace:members:";

    // Rate Limit
    public static final String RATE_LIMIT_PREFIX = "rate_limit:";

    // Cache TTL (seconds)
    public static final long DEFAULT_TTL = 3600;          // 1 hour
    public static final long USER_INFO_TTL = 1800;         // 30 minutes
    public static final long PERMISSIONS_TTL = 1800;       // 30 minutes
    public static final long WORKSPACE_INFO_TTL = 1800;    // 30 minutes
}
