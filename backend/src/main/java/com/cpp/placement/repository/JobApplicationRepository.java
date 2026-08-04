package com.cpp.placement.repository;

import com.cpp.placement.entity.ApplicationStatus;
import com.cpp.placement.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudentIdOrderByAppliedAtDesc(Long studentId);

    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);

    Optional<JobApplication> findByStudentIdAndJobId(Long studentId, Long jobId);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);

    long countByJobIdAndStatus(Long jobId, ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    List<JobApplication> findByJobPostedByTpoId(Long tpoId);
}
