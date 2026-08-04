package com.cpp.placement.dto.response;

public record AiPrepResponse(
        String companyName,
        String roundsBreakdown,
        String commonQuestions,
        String tips,
        boolean generated
) {
}
