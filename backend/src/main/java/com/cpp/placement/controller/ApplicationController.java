package com.cpp.placement.controller;

import com.cpp.placement.dto.request.ApplicationStatusUpdateRequest;
import com.cpp.placement.dto.response.ApplicationResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply/{jobId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationResponse> apply(@AuthenticationPrincipal CustomUserDetails user,
                                                       @PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.apply(user.getId(), jobId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationResponse>> myApplications(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(applicationService.listForStudent(user.getId()));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<ApplicationResponse>> forJob(@AuthenticationPrincipal CustomUserDetails user,
                                                              @PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.listForJob(user.getId(), jobId));
    }

    @GetMapping("/tpo")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<ApplicationResponse>> forTpo(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(applicationService.listForTpo(user.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<ApplicationResponse> updateStatus(@AuthenticationPrincipal CustomUserDetails user,
                                                              @PathVariable Long id,
                                                              @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(user.getId(), id, request));
    }
}
