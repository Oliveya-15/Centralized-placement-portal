package com.cpp.placement.repository;

import com.cpp.placement.entity.Job;
import com.cpp.placement.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);
    List<Job> findByPostedByTpoIdOrderByCreatedAtDesc(Long tpoId);
    List<Job> findAllByOrderByCreatedAtDesc();
}
