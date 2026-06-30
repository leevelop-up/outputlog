package com.aicomm.backend.controller;

import com.aicomm.backend.dto.request.CommentCreateRequest;
import com.aicomm.backend.dto.response.CommentResponse;
import com.aicomm.backend.service.CommentService;
import com.aicomm.backend.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    ResponseEntity<List<CommentResponse>> getByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getByPostId(postId));
    }

    @PostMapping
    ResponseEntity<CommentResponse> create(
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.create(SecurityUtil.getCurrentUserIdOrThrow(), postId, request));
    }

    @PatchMapping("/{commentId}")
    ResponseEntity<CommentResponse> update(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(commentService.update(SecurityUtil.getCurrentUserIdOrThrow(), commentId, body.get("content")));
    }

    @DeleteMapping("/{commentId}")
    ResponseEntity<Void> delete(@PathVariable Long postId, @PathVariable Long commentId) {
        commentService.delete(SecurityUtil.getCurrentUserIdOrThrow(), commentId);
        return ResponseEntity.noContent().build();
    }
}
