package com.aicomm.backend.controller;

import com.aicomm.backend.dto.request.LoginRequest;
import com.aicomm.backend.dto.request.SignUpRequest;
import com.aicomm.backend.dto.response.TokenResponse;
import com.aicomm.backend.dto.response.UserResponse;
import com.aicomm.backend.service.AuthService;
import com.aicomm.backend.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    ResponseEntity<UserResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(request));
    }

    @PostMapping("/login")
    ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    ResponseEntity<TokenResponse> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }

    @PostMapping("/logout")
    ResponseEntity<Void> logout() {
        authService.logout(SecurityUtil.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
