package com.aicomm.backend.security;

import com.aicomm.backend.entity.User;
import com.aicomm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);
        String registrationId = request.getClientRegistration().getRegistrationId();

        Map<String, Object> attrs = oAuth2User.getAttributes();
        String providerId;
        String email;
        String nickname;

        if ("github".equals(registrationId)) {
            providerId = String.valueOf(attrs.get("id"));
            String rawEmail = (String) attrs.get("email");
            email = (rawEmail != null && !rawEmail.isBlank()) ? rawEmail : (providerId + "@github.oauth");
            String rawLogin = (String) attrs.get("login");
            nickname = (rawLogin != null && !rawLogin.isBlank()) ? rawLogin : ("gh_" + providerId.substring(0, 6));
        } else if ("google".equals(registrationId)) {
            providerId = (String) attrs.get("sub");
            email = (String) attrs.get("email");
            nickname = ((String) attrs.getOrDefault("name", "user")).replaceAll("\\s+", "_");
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        final String finalEmail = email;
        final String finalNickname = nickname;
        final String finalProviderId = providerId;

        boolean[] isNew = {false};
        User user = userRepository.findByEmail(finalEmail)
            .orElseGet(() -> {
                isNew[0] = true;
                String base = finalNickname.length() > 25 ? finalNickname.substring(0, 25) : finalNickname;
                String unique = userRepository.findByNickname(base).isPresent()
                    ? base + "_" + UUID.randomUUID().toString().substring(0, 4)
                    : base;
                return userRepository.save(User.builder()
                    .email(finalEmail)
                    .password(null)
                    .nickname(unique)
                    .provider(registrationId)
                    .providerId(finalProviderId)
                    .build());
            });

        if (user.getProvider() == null) {
            user.linkOAuth(registrationId, finalProviderId);
            userRepository.save(user);
        }

        return new OAuth2UserPrincipal(user, attrs, isNew[0]);
    }
}
