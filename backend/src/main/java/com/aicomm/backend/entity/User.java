package com.aicomm.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column
    private String password;

    @Column(length = 20)
    private String provider;   // github, google (null = local)

    @Column(name = "provider_id")
    private String providerId;

    @Column(nullable = false, unique = true, length = 30)
    private String nickname;

    @Column(length = 500)
    private String bio;

    @Column(name = "profile_image")
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private int points = 0;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    public void linkOAuth(String provider, String providerId) {
        this.provider = provider;
        this.providerId = providerId;
    }

    public void updateProfile(String nickname, String bio, String profileImage) {
        this.nickname = nickname;
        this.bio = bio;
        this.profileImage = profileImage;
    }

    public void updateProfile(String nickname, String bio, String profileImage, String githubUrl, String websiteUrl) {
        this.nickname = nickname;
        this.bio = bio;
        this.profileImage = profileImage;
        this.githubUrl = githubUrl;
        this.websiteUrl = websiteUrl;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public void changeRole(Role role) {
        this.role = role;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void addPoints(int amount) {
        this.points = Math.max(0, this.points + amount);
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public enum Role {
        USER, ADMIN
    }
}
