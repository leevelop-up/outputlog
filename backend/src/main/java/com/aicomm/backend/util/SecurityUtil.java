package com.aicomm.backend.util;

import com.aicomm.backend.exception.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    private SecurityUtil() {}

    public static Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        try {
            return Long.parseLong(auth.getName());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static Long getCurrentUserIdOrThrow() {
        Long id = getCurrentUserId();
        if (id == null) throw BusinessException.unauthorized("로그인이 필요합니다.");
        return id;
    }
}
