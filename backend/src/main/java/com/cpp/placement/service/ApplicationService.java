package com.cpp.placement.service;

import com.cpp.placement.dto.request.ApplicationStatusUpdateRequest;
import com.cpp.placement.dto.response.ApplicationResponse;

import java.util.List;

public interface ApplicationService {
    ApplicationResponse apply(Long studentId, Long jobId);
    List<ApplicationResponse> listForStudent(Long studentId);
    List<ApplicationResponse> listForJob(Long tpoId, Long jobId);
    List<ApplicationResponse> listForTpo(Long tpoId);
    ApplicationResponse updateStatus(Long tpoId, Long applicationId, ApplicationStatusUpdateRequest request);
}
