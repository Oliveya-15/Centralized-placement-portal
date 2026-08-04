package com.cpp.placement.dto.request;

import com.cpp.placement.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationStatusUpdateRequest(
        @NotNull(message = "Status is required") ApplicationStatus status,
        String tpoNotes
) {
}
