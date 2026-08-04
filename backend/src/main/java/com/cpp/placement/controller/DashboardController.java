package com.cpp.placement.controller;

import com.cpp.placement.dto.response.DashboardStatsResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/tpo-stats")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<DashboardStatsResponse> tpoStats(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(dashboardService.getTpoStats(user.getId()));
    }
}
