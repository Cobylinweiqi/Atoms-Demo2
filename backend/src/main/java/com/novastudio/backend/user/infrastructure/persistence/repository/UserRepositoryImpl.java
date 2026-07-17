package com.novastudio.backend.user.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.novastudio.backend.user.domain.entity.User;
import com.novastudio.backend.user.domain.repository.UserRepository;
import com.novastudio.backend.user.infrastructure.persistence.converter.UserConverter;
import com.novastudio.backend.user.infrastructure.persistence.entity.UserDO;
import com.novastudio.backend.user.infrastructure.persistence.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserMapper userMapper;

    @Override
    public User save(User user) {
        UserDO userDO = UserConverter.toDO(user);
        if (userDO.getId() == null) {
            userMapper.insert(userDO);
        } else {
            userMapper.updateById(userDO);
        }
        return UserConverter.toDomain(userDO);
    }

    @Override
    public Optional<User> findById(Long id) {
        UserDO userDO = userMapper.selectById(id);
        return Optional.ofNullable(UserConverter.toDomain(userDO));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        UserDO userDO = userMapper.selectByEmail(email);
        return Optional.ofNullable(UserConverter.toDomain(userDO));
    }

    @Override
    public Optional<User> findByGithubId(String githubId) {
        UserDO userDO = userMapper.selectByGithubId(githubId);
        return Optional.ofNullable(UserConverter.toDomain(userDO));
    }

    @Override
    public Optional<User> findByGoogleId(String googleId) {
        UserDO userDO = userMapper.selectByGoogleId(googleId);
        return Optional.ofNullable(UserConverter.toDomain(userDO));
    }

    @Override
    public boolean existsByEmail(String email) {
        LambdaQueryWrapper<UserDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDO::getEmail, email);
        return userMapper.selectCount(wrapper) > 0;
    }

    @Override
    public void updateLastLoginAt(Long userId) {
        userMapper.updateLastLoginAt(userId, LocalDateTime.now());
    }
}
