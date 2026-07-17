package com.novastudio.backend.user.interfaces.rest.controller;

import com.novastudio.backend.common.response.ApiResponse;
import com.novastudio.backend.user.application.dto.UpdateUserCommand;
import com.novastudio.backend.user.application.dto.UserDTO;
import com.novastudio.backend.user.application.service.UserApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户", description = "用户管理接口")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserApplicationService userApplicationService;

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/me")
    public ApiResponse<UserDTO> getCurrentUser() {
        return ApiResponse.success(userApplicationService.getCurrentUser());
    }

    @Operation(summary = "更新当前用户资料")
    @PatchMapping("/me")
    public ApiResponse<UserDTO> updateProfile(@Valid @RequestBody UpdateUserCommand command) {
        return ApiResponse.success(userApplicationService.updateProfile(command));
    }

    @Operation(summary = "修改密码")
    @PostMapping("/me/password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userApplicationService.changePassword(request.getOldPassword(), request.getNewPassword());
        return ApiResponse.success(null, "密码修改成功");
    }

    @lombok.Data
    public static class ChangePasswordRequest {
        @jakarta.validation.constraints.NotBlank(message = "旧密码不能为空")
        private String oldPassword;

        @jakarta.validation.constraints.NotBlank(message = "新密码不能为空")
        @jakarta.validation.constraints.Size(min = 8, max = 64, message = "密码长度必须在8-64个字符之间")
        private String newPassword;
    }
}
