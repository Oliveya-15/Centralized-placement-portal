package com.cpp.placement.dto.response;

import com.cpp.placement.entity.ApplicationStatus;

import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        Long jobId,
        String companyName,
        String roleTitle,
        Long studentId,
        String studentName,
        String studentEmail,
        Double studentCgpa,
        ApplicationStatus status,
        String tpoNotes,
        LocalDateTime appliedAt,
        LocalDateTime updatedAt
) {
}
