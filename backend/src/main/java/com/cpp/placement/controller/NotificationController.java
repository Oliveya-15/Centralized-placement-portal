package com.cpp.placement.controller;

import com.cpp.placement.dto.request.NotificationRequest;
import com.cpp.placement.dto.response.NotificationResponse;
import com.cpp.placement.security.CustomUserDetails;
import com.cpp.placement.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<NotificationResponse> broadcast(@AuthenticationPrincipal CustomUserDetails user,
                                                            @Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.broadcast(user.getId(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<NotificationResponse>> myNotifications(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(notificationService.listForStudent(user.getId()));
    }

    @GetMapping("/sent")
    @PreAuthorize("hasRole('TPO')")
    public ResponseEntity<List<NotificationResponse>> sent(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(notificationService.listForTpo(user.getId()));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> markRead(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id) {
        notificationService.markRead(user.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
