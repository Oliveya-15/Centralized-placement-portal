package com.cpp.placement.service;

import com.cpp.placement.dto.response.DashboardStatsResponse;

public interface DashboardService {
    DashboardStatsResponse getTpoStats(Long tpoId);
}
