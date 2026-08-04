package com.cpp.placement.service;

import com.cpp.placement.dto.response.StudentProfileResponse;

import java.util.List;

public interface LedgerService {
    List<StudentProfileResponse> search(String branch, Double minCgpa, Integer maxBacklogs,
                                         Integer batchYear, String skill);
}
