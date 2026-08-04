package com.cpp.placement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, length = 150)
    private String roleTitle;

    @Column(length = 3000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobType jobType;

    @Column(length = 120)
    private String location;

    private Double ctcLpa; // package offered, in LPA

    // ---- Eligibility criteria (used for filtering, matching & broadcast) ----
    private Double minCgpa;

    private Integer maxBacklogs;

    @Column(length = 300)
    private String eligibleBranches; // comma separated, e.g. "CSE,IT,ECE"; blank/null = all branches

    @Column(length = 500)
    private String requiredSkills; // comma separated, used for AI fit-score matching

    // ---- Interview pipeline, shown on the AI Copilot & job detail page ----
    @Column(length = 2000)
    private String roundsBreakdown; // human readable, "Round 1: ... -> Round 2: ..."

    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private JobStatus status = JobStatus.OPEN;

    @Column(nullable = false)
    private Long postedByTpoId;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
