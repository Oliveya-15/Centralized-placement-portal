package com.cpp.placement.service.impl;

import com.cpp.placement.dto.request.StudentProfileRequest;
import com.cpp.placement.dto.response.StudentProfileResponse;
import com.cpp.placement.entity.StudentProfile;
import com.cpp.placement.entity.User;
import com.cpp.placement.exception.ResourceNotFoundException;
import com.cpp.placement.repository.StudentProfileRepository;
import com.cpp.placement.repository.UserRepository;
import com.cpp.placement.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public StudentProfileResponse getProfile(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return toResponse(profile);
    }

    @Override
    @Transactional
    public StudentProfileResponse updateProfile(Long userId, StudentProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        profile.setRollNumber(request.rollNumber());
        profile.setBranch(request.branch());
        profile.setBatchYear(request.batchYear());
        profile.setCgpa(request.cgpa());
        profile.setActiveBacklogs(request.activeBacklogs() == null ? 0 : request.activeBacklogs());
        profile.setSkills(request.skills());
        profile.setResumeLink(request.resumeLink());
        profile.setBio(request.bio());
        profile.setUpdatedAt(java.time.LocalDateTime.now());

        return toResponse(studentProfileRepository.save(profile));
    }

    private StudentProfileResponse toResponse(StudentProfile profile) {
        User user = profile.getUser();
        String tpoName = null;
        if (profile.getAssignedTpoId() != null) {
            tpoName = userRepository.findById(profile.getAssignedTpoId())
                    .map(User::getFullName)
                    .orElse(null);
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
