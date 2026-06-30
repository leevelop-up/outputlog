package com.aicomm.backend.service;

import com.aicomm.backend.dto.request.PostCreateRequest;
import com.aicomm.backend.dto.response.PostResponse;
import com.aicomm.backend.entity.Post;
import com.aicomm.backend.entity.PostLike;
import com.aicomm.backend.entity.PostTag;
import com.aicomm.backend.entity.User;
import com.aicomm.backend.exception.BusinessException;
import com.aicomm.backend.repository.PostLikeRepository;
import com.aicomm.backend.repository.PostRepository;
import com.aicomm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;

    @Transactional
    public PostResponse create(Long userId, PostCreateRequest request) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));

        Post post = Post.builder()
                .author(author)
                .title(request.title())
                .content(request.content())
                .sourceUrl(request.sourceUrl())
                .category(request.category())
                .build();

        if (request.tags() != null) {
            request.tags().forEach(tag -> post.getTags().add(
                    PostTag.builder().post(post).tag(tag).build()
            ));
        }

        return PostResponse.from(postRepository.save(post), false);
    }

    @Transactional
    public PostResponse getById(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> BusinessException.notFound("게시글을 찾을 수 없습니다."));
        post.incrementViewCount();
        boolean liked = userId != null && postLikeRepository.existsByPostIdAndUserId(postId, userId);
        return PostResponse.from(post, liked);
    }

    public Page<PostResponse> getList(Post.Category category, String keyword, Long userId, Pageable pageable) {
        Page<Post> posts;
        if (keyword != null && !keyword.isBlank()) {
            posts = postRepository.searchByKeyword(keyword, pageable);
        } else if (category != null) {
            posts = postRepository.findByCategory(category, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }
        return posts.map(p -> PostResponse.from(p,
                userId != null && postLikeRepository.existsByPostIdAndUserId(p.getId(), userId)));
    }

    @Transactional
    public PostResponse update(Long userId, Long postId, PostCreateRequest request) {
        Post post = getOwnedPost(userId, postId);
        post.update(request.title(), request.content(), request.sourceUrl(), request.category());
        return PostResponse.from(post, postLikeRepository.existsByPostIdAndUserId(postId, userId));
    }

    @Transactional
    public void delete(Long userId, Long postId) {
        Post post = getOwnedPost(userId, postId);
        postRepository.delete(post);
    }

    @Transactional
    public boolean toggleLike(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> BusinessException.notFound("게시글을 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));

        return postLikeRepository.findByPostIdAndUserId(postId, userId)
                .map(like -> {
                    postLikeRepository.delete(like);
                    post.decrementLikeCount();
                    return false;
                })
                .orElseGet(() -> {
                    postLikeRepository.save(PostLike.builder().post(post).user(user).build());
                    post.incrementLikeCount();
                    return true;
                });
    }

    public Page<PostResponse> getAdminList(Long userId, String category, String keyword, int page, int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending());
        Post.Category cat = (category != null && !category.isBlank())
                ? Post.Category.valueOf(category) : null;
        return getList(cat, keyword, userId, pageable);
    }

    @Transactional
    public void adminDelete(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> BusinessException.notFound("게시글을 찾을 수 없습니다."));
        postRepository.delete(post);
    }

    private Post getOwnedPost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> BusinessException.notFound("게시글을 찾을 수 없습니다."));
        if (!post.getAuthor().getId().equals(userId)) {
            throw BusinessException.forbidden("본인의 게시글만 수정/삭제할 수 있습니다.");
        }
        return post;
    }
}
