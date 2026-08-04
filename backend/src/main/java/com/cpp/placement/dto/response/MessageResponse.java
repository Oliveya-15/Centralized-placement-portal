package com.cpp.placement.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        Long senderId,
        Long receiverId,
        String content,
        boolean isRead,
        LocalDateTime sentAt
) {
}
