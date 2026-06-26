package com.aicomm.backend.dto.request;

import com.aicomm.backend.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PostCreateRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank String content,
        @NotNull Post.Category category,
        List<String> tags
) {}
