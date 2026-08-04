package com.cpp.placement.service.impl;

import com.cpp.placement.dto.response.DashboardStatsResponse;
import com.cpp.placement.entity.ApplicationStatus;
import com.cpp.placement.entity.Job;
import com.cpp.placement.entity.JobApplication;
import com.cpp.placement.entity.JobStatus;
import com.cpp.placement.repository.JobApplicationRepository;
import com.cpp.placement.repository.JobRepository;
import com.cpp.placement.repository.UserRepository;
import com.cpp.placement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getTpoStats(Long tpoId) {
        List<Job> jobs = jobRepository.findByPostedByTpoIdOrderByCreatedAtDesc(tpoId);
        List<JobApplication> applications = jobApplicationRepository.findByJobPostedByTpoId(tpoId);

        long openJobs = jobs.stream().filter(j -> j.getStatus() == JobStatus.OPEN).count();

        Map<ApplicationStatus, Long> byStatus = applications.stream()
                .collect(Collectors.groupingBy(JobApplication::getStatus,
                        () -> new EnumMap<>(ApplicationStatus.class), Collectors.counting()));

        Map<String, Long> byStatusStr = byStatus.entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey().name(), Map.Entry::getValue));

        Map<String, List<JobApplication>> byCompany = applications.stream()
                .collect(Collectors.groupingBy(a -> a.getJob().getCompanyName()));

        List<DashboardStatsResponse.CompanyFunnel> topCompanies = byCompany.entrySet().stream()
                .map(e -> new DashboardStatsResponse.CompanyFunnel(
                        e.getKey(),
                        e.getValue().size(),
                        e.getValue().stream().filter(a -> a.getStatus() == ApplicationStatus.SELECTED).count()))
                .sorted(Comparator.comparingLong(DashboardStatsResponse.CompanyFunnel::applicantCount).reversed())
                .limit(6)
                .toList();

        return new DashboardStatsResponse(
                userRepository.findByRole(com.cpp.placement.entity.Role.STUDENT).size(),
                jobs.size(),
                openJobs,
                applications.size(),
                byStatus.getOrDefault(ApplicationStatus.SELECTED, 0L),
                byStatus.getOrDefault(ApplicationStatus.SHORTLISTED, 0L),
                byStatus.getOrDefault(ApplicationStatus.REJECTED, 0L),
                byStatusStr,
                topCompanies
        );
    }
}
