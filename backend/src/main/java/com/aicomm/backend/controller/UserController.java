package com.aicomm.backend.controller;

import com.aicomm.backend.dto.response.UserResponse;
import com.aicomm.backend.entity.User;
import com.aicomm.backend.exception.BusinessException;
import com.aicomm.backend.repository.UserRepository;
import com.aicomm.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@RequestBody Map<String, String> body) {
        Long userId = SecurityUtil.getCurrentUserIdOrThrow();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));

        String nickname  = body.get("nickname");
        String bio       = body.get("bio");
        String githubUrl = body.get("githubUrl");
        String websiteUrl = body.get("websiteUrl");

        if (nickname != null && !nickname.isBlank()) {
            if (!nickname.equals(user.getNickname()) && userRepository.findByNickname(nickname).isPresent()) {
                throw BusinessException.badRequest("이미 사용 중인 닉네임입니다.");
            }
        }

        user.updateProfile(
            nickname != null && !nickname.isBlank() ? nickname.trim() : user.getNickname(),
            bio != null ? bio.trim() : user.getBio(),
            user.getProfileImage(),
            githubUrl != null ? githubUrl.trim() : user.getGithubUrl(),
            websiteUrl != null ? websiteUrl.trim() : user.getWebsiteUrl()
        );
        userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PostMapping("/setup")
    public ResponseEntity<UserResponse> setupProfile(@RequestBody Map<String, String> body) {
        Long userId = SecurityUtil.getCurrentUserIdOrThrow();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));

        String nickname = body.get("nickname");
        String job = body.get("job");
        String password = body.get("password");

        if (nickname == null || nickname.isBlank())
            throw BusinessException.badRequest("닉네임을 입력해주세요.");

        if (!nickname.equals(user.getNickname()) && userRepository.findByNickname(nickname.trim()).isPresent())
            throw BusinessException.badRequest("이미 사용 중인 닉네임입니다.");

        user.updateProfile(nickname.trim(), job != null ? job.trim() : null, user.getProfileImage());

        if (password != null && !password.isBlank()) {
            user.changePassword(passwordEncoder.encode(password));
        }

        userRepository.save(user);
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
