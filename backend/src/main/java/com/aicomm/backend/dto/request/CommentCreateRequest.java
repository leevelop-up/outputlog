package com.aicomm.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateRequest(
        @NotBlank String content,
        Long parentId
) {}
