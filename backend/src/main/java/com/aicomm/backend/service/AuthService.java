package com.aicomm.backend.service;

import com.aicomm.backend.dto.request.LoginRequest;
import com.aicomm.backend.dto.request.SignUpRequest;
import com.aicomm.backend.dto.response.TokenResponse;
import com.aicomm.backend.dto.response.UserResponse;
import com.aicomm.backend.entity.User;
import com.aicomm.backend.exception.BusinessException;
import com.aicomm.backend.repository.UserRepository;
import com.aicomm.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;

    @Transactional
    public UserResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw BusinessException.conflict("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.existsByNickname(request.nickname())) {
            throw BusinessException.conflict("이미 사용 중인 닉네임입니다.");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public TokenResponse login(LoginRequest request) {
        String identifier = request.email().trim();
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByNickname(identifier))
                .orElseThrow(() -> BusinessException.unauthorized("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw BusinessException.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        if (!user.isActive()) {
            throw BusinessException.forbidden("비활성화된 계정입니다.");
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        redisTemplate.opsForValue().set(
                "refresh:" + user.getId(),
                refreshToken,
                jwtTokenProvider.getRefreshTokenExpiry(),
                TimeUnit.MILLISECONDS
        );

        return TokenResponse.of(accessToken, refreshToken, UserResponse.from(user));
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw BusinessException.unauthorized("유효하지 않은 리프레시 토큰입니다.");
        }

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        String stored = redisTemplate.opsForValue().get("refresh:" + userId);

        if (!refreshToken.equals(stored)) {
            throw BusinessException.unauthorized("리프레시 토큰이 만료되었거나 이미 사용되었습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다."));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        redisTemplate.opsForValue().set(
                "refresh:" + userId,
                newRefreshToken,
                jwtTokenProvider.getRefreshTokenExpiry(),
                TimeUnit.MILLISECONDS
        );

        return TokenResponse.of(newAccessToken, newRefreshToken, UserResponse.from(user));
    }

    public void logout(Long userId) {
        redisTemplate.delete("refresh:" + userId);
    }

    public UserResponse getMe(Long userId) {
        return UserResponse.from(userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.notFound("사용자를 찾을 수 없습니다.")));
    }
}
