package com.cpp.placement.repository;

import com.cpp.placement.entity.NotificationRecipient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, Long> {

    @org.springframework.data.jpa.repository.Query("""
            SELECT nr FROM NotificationRecipient nr
            WHERE nr.studentId = :studentId
            ORDER BY nr.notification.createdAt DESC
            """)
    List<NotificationRecipient> findForStudent(Long studentId);

    Optional<NotificationRecipient> findByNotificationIdAndStudentId(Long notificationId, Long studentId);

    long countByStudentIdAndIsReadFalse(Long studentId);
}
