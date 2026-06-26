package com.aicomm.backend.controller;

import com.aicomm.backend.dto.request.PostCreateRequest;
import com.aicomm.backend.dto.response.PostResponse;
import com.aicomm.backend.entity.Post;
import com.aicomm.backend.service.PostService;
import com.aicomm.backend.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    ResponseEntity<Page<PostResponse>> getList(
            @RequestParam(required = false) Post.Category category,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(postService.getList(category, keyword, SecurityUtil.getCurrentUserId(), pageable));
    }

    @GetMapping("/{id}")
    ResponseEntity<PostResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id, SecurityUtil.getCurrentUserId()));
    }

    @PostMapping
    ResponseEntity<PostResponse> create(@Valid @RequestBody PostCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.create(SecurityUtil.getCurrentUserId(), request));
    }

    @PutMapping("/{id}")
    ResponseEntity<PostResponse> update(@PathVariable Long id, @Valid @RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(postService.update(SecurityUtil.getCurrentUserId(), id, request));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(SecurityUtil.getCurrentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    ResponseEntity<Map<String, Boolean>> toggleLike(@PathVariable Long id) {
        boolean liked = postService.toggleLike(SecurityUtil.getCurrentUserId(), id);
        return ResponseEntity.ok(Map.of("liked", liked));
    }
}
