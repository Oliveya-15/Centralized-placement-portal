package com.cpp.placement.service.impl;

import com.cpp.placement.dto.request.ApplicationStatusUpdateRequest;
import com.cpp.placement.dto.response.ApplicationResponse;
import com.cpp.placement.entity.*;
import com.cpp.placement.exception.BadRequestException;
import com.cpp.placement.exception.ResourceNotFoundException;
import com.cpp.placement.repository.JobApplicationRepository;
import com.cpp.placement.repository.JobRepository;
import com.cpp.placement.repository.StudentProfileRepository;
import com.cpp.placement.repository.UserRepository;
import com.cpp.placement.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Override
    @Transactional
    public ApplicationResponse apply(Long studentId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new BadRequestException("This job posting is closed for applications");
        }

        if (jobApplicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new BadRequestException("You have already applied to this job");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Complete your profile before applying"));

        assertEligible(profile, job);

        JobApplication application = JobApplication.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .build();

        return toResponse(jobApplicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> listForStudent(Long studentId) {
        return jobApplicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> listForJob(Long tpoId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getPostedByTpoId().equals(tpoId)) {
            throw new BadRequestException("You can only view applications for jobs you posted");
        }
        return jobApplicationRepository.findByJobIdOrderByAppliedAtDesc(jobId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> listForTpo(Long tpoId) {
        return jobApplicationRepository.findByJobPostedByTpoId(tpoId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(Long tpoId, Long applicationId, ApplicationStatusUpdateRequest request) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getJob().getPostedByTpoId().equals(tpoId)) {
            throw new BadRequestException("You can only manage applications for jobs you posted");
        }

        application.setStatus(request.status());
        if (request.tpoNotes() != null) {
            application.setTpoNotes(request.tpoNotes());
        }
        application.setUpdatedAt(java.time.LocalDateTime.now());

        return toResponse(jobApplicationRepository.save(application));
    }

    private void assertEligible(StudentProfile profile, Job job) {
        if (job.getMinCgpa() != null) {
            if (profile.getCgpa() == null || profile.getCgpa() < job.getMinCgpa()) {
                throw new BadRequestException(
                        "You don't meet the minimum CGPA requirement of " + job.getMinCgpa() + " for this role");
            }
        }
        if (job.getMaxBacklogs() != null) {
            int backlogs = profile.getActiveBacklogs() == null ? 0 : profile.getActiveBacklogs();
            if (backlogs > job.getMaxBacklogs()) {
                throw new BadRequestException(
                        "This role allows a maximum of " + job.getMaxBacklogs() + " active backlog(s)");
            }
        }
        if (job.getEligibleBranches() != null && !job.getEligibleBranches().isBlank()) {
            String branch = profile.getBranch() == null ? "" : profile.getBranch().trim().toLowerCase();
            boolean branchOk = Arrays.stream(job.getEligibleBranches().split(","))
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .anyMatch(b -> b.equals(branch));
            if (!branchOk) {
                throw new BadRequestException(
                        "This role is only open to students from: " + job.getEligibleBranches());
            }
        }
    }

    private ApplicationResponse toResponse(JobApplication application) {
        StudentProfile profile = studentProfileRepository.findByUserId(application.getStudent().getId())
                .orElse(null);
        return new ApplicationResponse(
                application.getId(),
                application.getJob().getId(),
                application.getJob().getCompanyName(),
                application.getJob().getRoleTitle(),
                application.getStudent().getId(),
                application.getStudent().getFullName(),
                application.getStudent().getEmail(),
                profile != null ? profile.getCgpa() : null,
                application.getStatus(),
                application.getTpoNotes(),
                application.getAppliedAt(),
                application.getUpdatedAt()
        );
    }
}
