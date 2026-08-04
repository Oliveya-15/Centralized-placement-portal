package com.cpp.placement.service.impl;

import com.cpp.placement.dto.request.NotificationRequest;
import com.cpp.placement.dto.response.NotificationResponse;
import com.cpp.placement.entity.Notification;
import com.cpp.placement.entity.NotificationRecipient;
import com.cpp.placement.entity.StudentProfile;
import com.cpp.placement.exception.ResourceNotFoundException;
import com.cpp.placement.repository.NotificationRecipientRepository;
import com.cpp.placement.repository.NotificationRepository;
import com.cpp.placement.repository.StudentProfileRepository;
import com.cpp.placement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Override
    @Transactional
    public NotificationResponse broadcast(Long tpoId, NotificationRequest request) {
        List<StudentProfile> matched = studentProfileRepository.search(
                blank(request.branch()), request.minCgpa(), request.maxBacklogs(),
                request.batchYear(), blank(request.skill()));

        Notification notification = Notification.builder()
                .title(request.title())
                .message(request.message())
                .criteriaSummary(buildCriteriaSummary(request))
                .createdByTpoId(tpoId)
                .recipientCount(matched.size())
                .build();
        notification = notificationRepository.save(notification);

        List<NotificationRecipient> recipients = new ArrayList<>();
        for (StudentProfile profile : matched) {
            recipients.add(NotificationRecipient.builder()
                    .notification(notification)
                    .studentId(profile.getUser().getId())
                    .build());
        }
        recipientRepository.saveAll(recipients);

        return toResponse(notification, false);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> listForStudent(Long studentId) {
        return recipientRepository.findForStudent(studentId).stream()
                .map(r -> toResponse(r.getNotification(), r.isRead()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> listForTpo(Long tpoId) {
        return notificationRepository.findByCreatedByTpoIdOrderByCreatedAtDesc(tpoId).stream()
                .map(n -> toResponse(n, false))
                .toList();
    }

    @Override
    @Transactional
    public void markRead(Long studentId, Long notificationId) {
        NotificationRecipient recipient = recipientRepository
                .findByNotificationIdAndStudentId(notificationId, studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found for this student"));
        recipient.setRead(true);
        recipientRepository.save(recipient);
    }

    private String blank(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    private String buildCriteriaSummary(NotificationRequest r) {
        List<String> parts = new ArrayList<>();
        if (r.minCgpa() != null) parts.add("CGPA >= " + r.minCgpa());
        if (r.maxBacklogs() != null) parts.add("Backlogs <= " + r.maxBacklogs());
        if (r.branch() != null && !r.branch().isBlank()) parts.add("Branch = " + r.branch());
        if (r.batchYear() != null) parts.add("Batch = " + r.batchYear());
        if (r.skill() != null && !r.skill().isBlank()) parts.add("Skill = " + r.skill());
        return parts.isEmpty() ? "All students" : String.join(" AND ", parts);
    }

    private NotificationResponse toResponse(Notification n, boolean read) {
        return new NotificationResponse(
                n.getId(), n.getTitle(), n.getMessage(), n.getCriteriaSummary(),
                n.getRecipientCount(), read, n.getCreatedAt()
        );
    }
}
