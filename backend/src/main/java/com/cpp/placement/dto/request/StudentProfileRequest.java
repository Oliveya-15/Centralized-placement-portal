package com.cpp.placement.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

public record StudentProfileRequest(
        String rollNumber,
        String branch,
        Integer batchYear,
        @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
        @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
        Double cgpa,
        @Min(value = 0, message = "Backlogs cannot be negative")
        Integer activeBacklogs,
        String skills,
        String resumeLink,
        String bio
) {
}
