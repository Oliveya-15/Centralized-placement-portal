package com.cpp.placement.service;

import com.cpp.placement.dto.request.StudentProfileRequest;
import com.cpp.placement.dto.response.StudentProfileResponse;

public interface StudentService {
    StudentProfileResponse getProfile(Long userId);
    StudentProfileResponse updateProfile(Long userId, StudentProfileRequest request);
}
