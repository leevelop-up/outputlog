package com.aicomm.backend.service;

import com.aicomm.backend.dto.request.CommentCreateRequest;
import com.aicomm.backend.dto.response.CommentResponse;
import com.aicomm.backend.entity.Comment;
import com.aicomm.backend.entity.Post;
import com.aicomm.backend.entity.User;
import com.aicomm.backend.exception.BusinessException;
import com.aicomm.backend.repository.CommentRepository;
import com.aicomm.backend.repository.PostRepository;
import com.aicomm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getByPostId(Long postId) {
        return commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtAsc(postId)
                .stream().map(CommentResponse::from).toList();
    }

    @Transactional
    public CommentResponse create(Long userId, Long postId, CommentCreateRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> BusinessException.notFound("게시글을 찾을 수 없습니다."));

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> BusinessException.notFound("부모 댓글을 찾을 수 없습니다."));
        }

        Comment comment = Comment.builder()
                .post(post)
                .author(author)
                .parent(parent)
                .content(request.content())
                .build();

        return CommentResponse.from(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse update(Long userId, Long commentId, String content) {
        Comment comment = getOwnedComment(userId, commentId);
        comment.update(content);
        return CommentResponse.from(comment);
    }

    @Transactional
    public void delete(Long userId, Long commentId) {
        Comment comment = getOwnedComment(userId, commentId);
        commentRepository.delete(comment);
    }

    private Comment getOwnedComment(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> BusinessException.notFound("댓글을 찾을 수 없습니다."));
        if (!comment.getAuthor().getId().equals(userId)) {
            throw BusinessException.forbidden("본인의 댓글만 수정/삭제할 수 있습니다.");
        }
        return comment;
    }
}
