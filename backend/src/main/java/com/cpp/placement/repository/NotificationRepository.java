package com.cpp.placement.repository;

import com.cpp.placement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByCreatedByTpoIdOrderByCreatedAtDesc(Long tpoId);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
