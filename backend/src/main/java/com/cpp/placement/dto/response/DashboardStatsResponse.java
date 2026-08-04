package com.cpp.placement.dto.response;

import java.util.List;
import java.util.Map;

public record DashboardStatsResponse(
        long totalStudents,
        long totalJobs,
        long openJobs,
        long totalApplications,
        long selectedCount,
        long shortlistedCount,
        long rejectedCount,
        Map<String, Long> applicationsByStatus,
        List<CompanyFunnel> topCompaniesByApplicants
) {
    public record CompanyFunnel(String companyName, long applicantCount, long selectedCount) {
    }
}
