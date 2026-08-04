package com.cpp.placement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 40)
    private String rollNumber;

    @Column(length = 80)
    private String branch;

    private Integer batchYear;

    private Double cgpa;

    @Builder.Default
    private Integer activeBacklogs = 0;

    @Column(length = 1000)
    private String skills; // comma separated, e.g. "Java,React,SQL"

    @Column(length = 300)
    private String resumeLink;

    @Column(length = 1000)
    private String bio;

    /** The TPO professor this student can message directly ("Professor Desk"). */
    private Long assignedTpoId;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
