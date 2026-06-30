package com.aicomm.backend.controller;

import com.aicomm.backend.dto.response.AdminStatsResponse;
import com.aicomm.backend.dto.response.AdminUserResponse;
import com.aicomm.backend.dto.response.PostResponse;
import com.aicomm.backend.entity.User;
import com.aicomm.backend.exception.BusinessException;
import com.aicomm.backend.repository.CommentRepository;
import com.aicomm.backend.repository.PostRepository;
import com.aicomm.backend.repository.UserRepository;
import com.aicomm.backend.service.PostService;
import com.aicomm.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostService postService;

    private void requireAdmin() {
        Long userId = SecurityUtil.getCurrentUserIdOrThrow();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));
        if (user.getRole() != User.Role.ADMIN) {
            throw BusinessException.forbidden("관리자 권한이 필요합니다.");
        }
    }

    // ── 통계 ────────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        requireAdmin();
        long totalUsers    = userRepository.count();
        long totalPosts    = postRepository.count();
        long totalComments = commentRepository.count();
        long adminCount    = userRepository.countByRole(User.Role.ADMIN);
        long activeUsers   = userRepository.countByActive(true);

        return ResponseEntity.ok(new AdminStatsResponse(
                totalUsers, totalPosts, totalComments, adminCount, activeUsers
        ));
    }

    // ── 회원 관리 ────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword
    ) {
        requireAdmin();
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AdminUserResponse> result = keyword != null && !keyword.isBlank()
                ? userRepository.searchByKeyword(keyword, pageable).map(AdminUserResponse::from)
                : userRepository.findAll(pageable).map(AdminUserResponse::from);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<AdminUserResponse> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));
        User.Role newRole = User.Role.valueOf(body.get("role").toUpperCase());
        user.changeRole(newRole);
        return ResponseEntity.ok(AdminUserResponse.from(userRepository.save(user)));
    }

    @PatchMapping("/users/{id}/active")
    public ResponseEntity<AdminUserResponse> updateActive(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));
        user.setActive(body.get("active"));
        return ResponseEntity.ok(AdminUserResponse.from(userRepository.save(user)));
    }

    // ── 게시글 관리 ──────────────────────────────────────────────────

    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword
    ) {
        requireAdmin();
        Long userId = SecurityUtil.getCurrentUserIdOrThrow();
        return ResponseEntity.ok(postService.getAdminList(userId, category, keyword, page, size));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        requireAdmin();
        postService.adminDelete(id);
        return ResponseEntity.noContent().build();
    }
}
