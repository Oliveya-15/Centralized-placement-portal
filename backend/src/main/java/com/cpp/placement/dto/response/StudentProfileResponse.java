package com.cpp.placement.dto.response;

public record StudentProfileResponse(
        Long userId,
        String fullName,
        String email,
        String phone,
        String rollNumber,
        String branch,
        Integer batchYear,
        Double cgpa,
        Integer activeBacklogs,
        String skills,
        String resumeLink,
        String bio,
        Long assignedTpoId,
        String assignedTpoName
) {
}
