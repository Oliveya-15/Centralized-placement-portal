package com.cpp.placement.service;

import com.cpp.placement.dto.request.JobRequest;
import com.cpp.placement.dto.response.JobResponse;

import java.util.List;

public interface JobService {
    JobResponse createJob(Long tpoId, JobRequest request);
    JobResponse updateJob(Long tpoId, Long jobId, JobRequest request);
    JobResponse closeJob(Long tpoId, Long jobId);
    JobResponse getJob(Long jobId);
    List<JobResponse> listOpenJobs();
    List<JobResponse> listAllJobs();
    List<JobResponse> listJobsByTpo(Long tpoId);
}
