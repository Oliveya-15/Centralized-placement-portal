package com.cpp.placement.service.impl;

import com.cpp.placement.dto.response.StudentProfileResponse;
import com.cpp.placement.entity.StudentProfile;
import com.cpp.placement.entity.User;
import com.cpp.placement.repository.StudentProfileRepository;
import com.cpp.placement.repository.UserRepository;
import com.cpp.placement.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerServiceImpl implements LedgerService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StudentProfileResponse> search(String branch, Double minCgpa, Integer maxBacklogs,
                                                Integer batchYear, String skill) {
        return studentProfileRepository
                .search(blankToNull(branch), minCgpa, maxBacklogs, batchYear, blankToNull(skill))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    private StudentProfileResponse toResponse(StudentProfile profile) {
        User user = profile.getUser();
        String tpoName = null;
        if (profile.getAssignedTpoId() != null) {
            tpoName = userRepository.findById(profile.getAssignedTpoId()).map(User::getFullName).orElse(null);
        }
        return new StudentProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                profile.getRollNumber(),
                profile.getBranch(),
                profile.getBatchYear(),
                profile.getCgpa(),
                profile.getActiveBacklogs(),
                profile.getSkills(),
                profile.getResumeLink(),
                profile.getBio(),
                profile.getAssignedTpoId(),
                tpoName
        );
    }
}
