package com.cpp.placement.service;

import com.cpp.placement.dto.request.NotificationRequest;
import com.cpp.placement.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {
    NotificationResponse broadcast(Long tpoId, NotificationRequest request);
    List<NotificationResponse> listForStudent(Long studentId);
    List<NotificationResponse> listForTpo(Long tpoId);
    void markRead(Long studentId, Long notificationId);
}
