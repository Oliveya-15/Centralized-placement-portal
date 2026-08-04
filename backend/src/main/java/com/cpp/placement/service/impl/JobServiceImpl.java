package com.cpp.placement.service.impl;

import com.cpp.placement.dto.request.JobRequest;
import com.cpp.placement.dto.response.JobResponse;
import com.cpp.placement.entity.Job;
import com.cpp.placement.entity.JobStatus;
import com.cpp.placement.exception.BadRequestException;
import com.cpp.placement.exception.ResourceNotFoundException;
import com.cpp.placement.repository.JobApplicationRepository;
import com.cpp.placement.repository.JobRepository;
import com.cpp.placement.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    @Override
    @Transactional
    public JobResponse createJob(Long tpoId, JobRequest request) {
        Job job = Job.builder()
                .companyName(request.companyName())
                .roleTitle(request.roleTitle())
                .description(request.description())
                .jobType(request.jobType())
                .location(request.location())
                .ctcLpa(request.ctcLpa())
                .minCgpa(request.minCgpa())
                .maxBacklogs(request.maxBacklogs())
                .eligibleBranches(request.eligibleBranches())
                .requiredSkills(request.requiredSkills())
                .roundsBreakdown(request.roundsBreakdown())
                .applicationDeadline(request.applicationDeadline())
                .status(JobStatus.OPEN)
                .postedByTpoId(tpoId)
                .build();

        return toResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long tpoId, Long jobId, JobRequest request) {
        Job job = findOwnedJob(tpoId, jobId);

        job.setCompanyName(request.companyName());
        job.setRoleTitle(request.roleTitle());
        job.setDescription(request.description());
        job.setJobType(request.jobType());
        job.setLocation(request.location());
        job.setCtcLpa(request.ctcLpa());
        job.setMinCgpa(request.minCgpa());
        job.setMaxBacklogs(request.maxBacklogs());
        job.setEligibleBranches(request.eligibleBranches());
        job.setRequiredSkills(request.requiredSkills());
        job.setRoundsBreakdown(request.roundsBreakdown());
        job.setApplicationDeadline(request.applicationDeadline());

        return toResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    public JobResponse closeJob(Long tpoId, Long jobId) {
        Job job = findOwnedJob(tpoId, jobId);
        job.setStatus(JobStatus.CLOSED);
        return toResponse(jobRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJob(Long jobId) {
        return toResponse(jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> listOpenJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> listAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> listJobsByTpo(Long tpoId) {
        return jobRepository.findByPostedByTpoIdOrderByCreatedAtDesc(tpoId)
                .stream().map(this::toResponse).toList();
    }

    private Job findOwnedJob(Long tpoId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getPostedByTpoId().equals(tpoId)) {
            throw new BadRequestException("You can only manage job postings you created");
        }
        return job;
    }

    private JobResponse toResponse(Job job) {
        long applicantCount = jobApplicationRepository.findByJobIdOrderByAppliedAtDesc(job.getId()).size();
        return new JobResponse(
                job.getId(),
                job.getCompanyName(),
                job.getRoleTitle(),
                job.getDescription(),
                job.getJobType(),
                job.getLocation(),
                job.getCtcLpa(),
                job.getMinCgpa(),
                job.getMaxBacklogs(),
                job.getEligibleBranches(),
                job.getRequiredSkills(),
                job.getRoundsBreakdown(),
                job.getApplicationDeadline(),
                job.getStatus(),
                job.getPostedByTpoId(),
                applicantCount,
                job.getCreatedAt()
        );
    }
}
