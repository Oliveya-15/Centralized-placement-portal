package com.cpp.placement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessageRequest(
        @NotNull(message = "receiverId is required") Long receiverId,
        @NotBlank(message = "Message content cannot be empty") String content
) {
}
