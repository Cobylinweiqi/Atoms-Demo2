package com.novastudio.backend.user.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.user.application.dto.AuthDTO;
import com.novastudio.backend.user.application.dto.LoginCommand;
import com.novastudio.backend.user.application.dto.RegisterCommand;
import com.novastudio.backend.user.application.service.UserApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "认证", description = "用户认证相关接口")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserApplicationService userApplicationService;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public ApiResponse<AuthDTO> register(@Valid @RequestBody RegisterCommand command) {
        return ApiResponse.created(userApplicationService.register(command));
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public ApiResponse<AuthDTO> login(@Valid @RequestBody LoginCommand command) {
        return ApiResponse.success(userApplicationService.login(command));
    }

    @Operation(summary = "登出")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("Authorization") String authorization,
                                    @RequestBody(required = false) RefreshTokenRequest request) {
        String accessToken = authorization != null ? authorization.replace("Bearer ", "") : null;
        String refreshToken = request != null ? request.getRefreshToken() : null;
        userApplicationService.logout(accessToken, refreshToken);
        return ApiResponse.success(null, "已登出");
    }

    @Operation(summary = "刷新Token")
    @PostMapping("/refresh")
    public ApiResponse<AuthDTO> refresh(@RequestBody RefreshTokenRequest request) {
        return ApiResponse.success(userApplicationService.refresh(request.getRefreshToken()));
    }

    @Operation(summary = "获取当前用户")
    @GetMapping("/me")
    public ApiResponse<Object> me() {
        return ApiResponse.success(userApplicationService.getCurrentUser());
    }

    @lombok.Data
    public static class RefreshTokenRequest {
        private String refreshToken;
    }
}
