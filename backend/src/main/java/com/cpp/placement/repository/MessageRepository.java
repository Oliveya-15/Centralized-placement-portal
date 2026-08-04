package com.cpp.placement.repository;

import com.cpp.placement.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
            SELECT m FROM Message m
            WHERE (m.senderId = :userA AND m.receiverId = :userB)
               OR (m.senderId = :userB AND m.receiverId = :userA)
            ORDER BY m.sentAt ASC
            """)
    List<Message> findThread(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("""
            SELECT DISTINCT CASE WHEN m.senderId = :userId THEN m.receiverId ELSE m.senderId END
            FROM Message m
            WHERE m.senderId = :userId OR m.receiverId = :userId
            """)
    List<Long> findContactIds(@Param("userId") Long userId);

    long countByReceiverIdAndIsReadFalse(Long receiverId);
}
