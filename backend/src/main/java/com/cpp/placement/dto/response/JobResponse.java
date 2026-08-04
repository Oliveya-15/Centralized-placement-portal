package com.cpp.placement.dto.response;

import com.cpp.placement.entity.JobStatus;
import com.cpp.placement.entity.JobType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record JobResponse(
        Long id,
        String companyName,
        String roleTitle,
        String description,
        JobType jobType,
        String location,
        Double ctcLpa,
        Double minCgpa,
        Integer maxBacklogs,
        String eligibleBranches,
        String requiredSkills,
        String roundsBreakdown,
        LocalDate applicationDeadline,
        JobStatus status,
        Long postedByTpoId,
        long applicantCount,
        LocalDateTime createdAt
) {
}
