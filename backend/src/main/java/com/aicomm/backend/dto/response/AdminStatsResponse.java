package com.aicomm.backend.dto.response;

public record AdminStatsResponse(
        long totalUsers,
        long totalPosts,
        long totalComments,
        long adminCount,
        long activeUsers
) {}
