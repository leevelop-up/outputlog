package com.aicomm.backend.dto.response;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        UserResponse user
) {
    public static TokenResponse of(String accessToken, String refreshToken, UserResponse user) {
        return new TokenResponse(accessToken, refreshToken, "Bearer", user);
    }
}
