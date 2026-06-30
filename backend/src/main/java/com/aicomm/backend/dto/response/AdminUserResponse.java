package com.aicomm.backend.dto.response;

import com.aicomm.backend.entity.User;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String email,
        String nickname,
        String role,
        String provider,
        boolean active,
        LocalDateTime createdAt
) {
    public static AdminUserResponse from(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole().name(),
                user.getProvider(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
