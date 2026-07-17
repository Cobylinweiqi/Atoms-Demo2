package com.novastudio.backend.user.application.service;

import com.novastudio.backend.common.constant.RedisConstants;
import com.novastudio.backend.common.exception.BusinessException;
import com.novastudio.backend.common.response.ErrorCode;
import com.novastudio.backend.common.security.JwtUtil;
import com.novastudio.backend.common.security.SecurityUtils;
import com.novastudio.backend.user.application.assembler.UserAssembler;
import com.novastudio.backend.user.application.dto.*;
import com.novastudio.backend.user.domain.entity.User;
import com.novastudio.backend.user.domain.repository.UserRepository;
import com.novastudio.backend.user.domain.service.UserDomainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserApplicationService {

    private final UserRepository userRepository;
    private final UserDomainService userDomainService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate stringRedisTemplate;

    /**
     * 用户注册
     */
    @Transactional
    public AuthDTO register(RegisterCommand command) {
        // 领域校验：检查邮箱是否可用
        userDomainService.checkEmailAvailable(command.getEmail());

        // 创建领域实体
        String passwordHash = passwordEncoder.encode(command.getPassword());
        User user = User.register(command.getEmail(), command.getName(), passwordHash);

        // 持久化
        user = userRepository.save(user);
        log.info("User registered: id={}, email={}", user.getId(), user.getEmail());

        // 生成Token
        return generateAuthDTO(user);
    }

    /**
     * 用户登录
     */
    @Transactional
    public AuthDTO login(LoginCommand command) {
        // 查找用户
        User user = userDomainService.findByEmail(command.getEmail());

        // 验证密码
        if (user.getPasswordHash() == null || !passwordEncoder.matches(command.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        // 记录登录时间
        user.recordLogin();
        userRepository.updateLastLoginAt(user.getId());
        log.info("User logged in: id={}, email={}", user.getId(), user.getEmail());

        return generateAuthDTO(user);
    }

    /**
     * 刷新Token
     */
    public AuthDTO refresh(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken) || !"refresh".equals(jwtUtil.getTokenType(refreshToken))) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
        }

        // 检查是否在黑名单
        Boolean isBlacklisted = stringRedisTemplate.hasKey(RedisConstants.JWT_BLACKLIST_PREFIX + refreshToken);
        if (Boolean.TRUE.equals(isBlacklisted)) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
        }

        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userDomainService.findById(userId);

        return generateAuthDTO(user);
    }

    /**
     * 登出
     */
    public void logout(String accessToken, String refreshToken) {
        if (StringUtils.hasText(accessToken)) {
            stringRedisTemplate.opsForValue().set(
                    RedisConstants.JWT_BLACKLIST_PREFIX + accessToken,
                    "1",
                    jwtUtil.getAccessTokenExpiration(),
                    TimeUnit.MILLISECONDS);
        }
        if (StringUtils.hasText(refreshToken)) {
            stringRedisTemplate.opsForValue().set(
                    RedisConstants.JWT_BLACKLIST_PREFIX + refreshToken,
                    "1",
                    jwtUtil.getRefreshTokenExpiration(),
                    TimeUnit.MILLISECONDS);
        }
        log.info("User logged out");
    }

    /**
     * 获取当前用户信息
     */
    public UserDTO getCurrentUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userDomainService.findById(userId);
        return UserAssembler.toDTO(user);
    }

    /**
     * 更新当前用户资料
     */
    @Transactional
    public UserDTO updateProfile(UpdateUserCommand command) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userDomainService.findById(userId);

        user.updateProfile(command.getName(), command.getAvatarUrl(),
                command.getPreferredModel(), command.getLocale());

        user = userRepository.save(user);
        return UserAssembler.toDTO(user);
    }

    /**
     * 修改密码
     */
    @Transactional
    public void changePassword(String oldPassword, String newPassword) {
        Long userId = SecurityUtils.getCurrentUserId();
        User user = userDomainService.findById(userId);

        if (user.getPasswordHash() == null || !passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        user.updatePassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("User password changed: id={}", userId);
    }

    private AuthDTO generateAuthDTO(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getEmail());

        return AuthDTO.builder()
                .user(UserAssembler.toDTO(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtUtil.getAccessTokenExpiration() / 1000)
                .build();
    }
}
