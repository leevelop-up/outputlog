package com.aicomm.backend.dto.response;

import com.aicomm.backend.entity.Post;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
        Long id,
        String title,
        String content,
        String category,
        int viewCount,
        int likeCount,
        boolean likedByMe,
        UserResponse author,
        List<String> tags,
        int commentCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PostResponse from(Post post, boolean likedByMe) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory().name(),
                post.getViewCount(),
                post.getLikeCount(),
                likedByMe,
                UserResponse.from(post.getAuthor()),
                post.getTags().stream().map(t -> t.getTag()).toList(),
                post.getComments().size(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
