package com.cpp.placement.dto.response;

import java.util.List;

public record FitScoreResponse(
        Long jobId,
        String companyName,
        int fitScorePercent,
        List<String> matchedReasons,
        List<String> gaps
) {
}
