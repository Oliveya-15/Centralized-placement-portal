package com.cpp.placement.dto.request;

import com.cpp.placement.entity.JobType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record JobRequest(
        @NotBlank(message = "Company name is required") String companyName,
        @NotBlank(message = "Role title is required") String roleTitle,
        String description,
        @NotNull(message = "Job type is required") JobType jobType,
        String location,
        Double ctcLpa,
        Double minCgpa,
        Integer maxBacklogs,
        String eligibleBranches,
        String requiredSkills,
        String roundsBreakdown,
        LocalDate applicationDeadline
) {
}
