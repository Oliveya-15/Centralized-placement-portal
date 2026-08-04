package com.cpp.placement.dto.request;

import jakarta.validation.constraints.NotBlank;

public record NotificationRequest(
        @NotBlank(message = "Title is required") String title,
        @NotBlank(message = "Message is required") String message,
        // Targeting criteria - same shape as the master ledger filters.
        // Leave any field null/blank to not filter on it (null everywhere = broadcast to all students).
        String branch,
        Double minCgpa,
        Integer maxBacklogs,
        Integer batchYear,
        String skill
) {
}
