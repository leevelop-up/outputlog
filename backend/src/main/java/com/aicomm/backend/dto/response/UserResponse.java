package com.aicomm.backend.dto.response;

import com.aicomm.backend.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String nickname,
        String bio,
        String profileImage,
        String role,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getBio(),
                user.getProfileImage(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
