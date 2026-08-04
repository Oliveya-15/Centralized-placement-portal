package com.cpp.placement.dto.response;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String message,
        String criteriaSummary,
        int recipientCount,
        boolean read,
        LocalDateTime createdAt
) {
}
