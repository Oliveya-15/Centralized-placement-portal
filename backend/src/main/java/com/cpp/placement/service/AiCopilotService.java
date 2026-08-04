package com.cpp.placement.service;

import com.cpp.placement.dto.response.AiPrepResponse;
import com.cpp.placement.dto.response.FitScoreResponse;

public interface AiCopilotService {
    AiPrepResponse getPrepGuide(String companyName);
    FitScoreResponse getFitScore(Long studentId, Long jobId);
}
