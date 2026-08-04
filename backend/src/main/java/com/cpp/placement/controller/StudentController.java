package com.cpp.placement.controller;

import com.cpp.placement.dto.request.StudentProfileRequest;
import com.cpp.placement.dto.response.StudentProfileResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> getMyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(studentService.getProfile(user.getId()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfileResponse> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentService.updateProfile(user.getId(), request));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<StudentProfileResponse> getStudentProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getProfile(userId));
    }
}
