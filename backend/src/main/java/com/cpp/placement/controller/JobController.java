package com.cpp.placement.controller;

import com.cpp.placement.dto.request.JobRequest;
import com.cpp.placement.dto.response.JobResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobResponse>> listOpenJobs() {
        return ResponseEntity.ok(jobService.listOpenJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<JobResponse>> myJobs(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(jobService.listJobsByTpo(user.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<JobResponse>> allJobs() {
        return ResponseEntity.ok(jobService.listAllJobs());
    }

    @PostMapping
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<JobResponse> createJob(@AuthenticationPrincipal CustomUserDetails user,
                                                  @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.createJob(user.getId(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<JobResponse> updateJob(@AuthenticationPrincipal CustomUserDetails user,
                                                  @PathVariable Long id,
                                                  @Valid @RequestBody JobRequest request) {
        return ResponseEntity.ok(jobService.updateJob(user.getId(), id, request));
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<JobResponse> closeJob(@AuthenticationPrincipal CustomUserDetails user,
                                                 @PathVariable Long id) {
        return ResponseEntity.ok(jobService.closeJob(user.getId(), id));
    }
}
