package com.novastudio.backend.user.domain.repository;

import com.novastudio.backend.user.domain.entity.User;

import java.util.Optional;

/**
 * 用户仓储接口 (Domain Repository Interface)
 * 定义在领域层，由基础设施层实现
 */
public interface UserRepository {

    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    Optional<User> findByGithubId(String githubId);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    void updateLastLoginAt(Long userId);
}
