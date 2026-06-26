package com.aicomm.backend.dto.response;

import com.aicomm.backend.entity.Comment;

import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
        Long id,
        String content,
        UserResponse author,
        List<CommentResponse> replies,
        int likeCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                UserResponse.from(comment.getAuthor()),
                comment.getReplies().stream().map(CommentResponse::from).toList(),
                comment.getLikeCount(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}
