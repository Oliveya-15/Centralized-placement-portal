package com.cpp.placement.controller;

import com.cpp.placement.dto.response.AiPrepResponse;
import com.cpp.placement.dto.response.FitScoreResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.AiCopilotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiCopilotController {

    private final AiCopilotService aiCopilotService;

    @GetMapping("/prep/{companyName}")
    public ResponseEntity<AiPrepResponse> prepGuide(@PathVariable String companyName) {
        return ResponseEntity.ok(aiCopilotService.getPrepGuide(companyName));
    }

    @GetMapping("/fit-score/{jobId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<FitScoreResponse> fitScore(@AuthenticationPrincipal CustomUserDetails user,
                                                       @PathVariable Long jobId) {
        return ResponseEntity.ok(aiCopilotService.getFitScore(user.getId(), jobId));
    }
}
