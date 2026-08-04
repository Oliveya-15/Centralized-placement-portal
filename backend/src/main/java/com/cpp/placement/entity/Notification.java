package com.cpp.placement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String message;

    /** Human readable snapshot of the filter used, e.g. "CGPA >= 8.0 AND Skill = Java" */
    @Column(length = 300)
    private String criteriaSummary;

    @Column(nullable = false)
    private Long createdByTpoId;

    @Builder.Default
    @Column(nullable = false)
    private int recipientCount = 0;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
