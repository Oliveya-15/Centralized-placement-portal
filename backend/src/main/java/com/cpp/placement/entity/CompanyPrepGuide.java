package com.cpp.placement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Powers the "AI Placement Copilot": company-specific interview pipeline
 * mapping, tips and commonly asked questions. Seeded for a handful of
 * well-known recruiters; AiCopilotService falls back to a generated
 * generic guide for any company that doesn't have one yet.
 *
 * To plug in a real LLM later, swap the lookup in AiCopilotServiceImpl
 * for a call to your model provider of choice - the controller/DTO
 * contract stays the same.
 */
@Entity
@Table(name = "company_prep_guides")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPrepGuide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String companyName;

    @Column(nullable = false, length = 2000)
    private String roundsBreakdown;

    @Column(length = 2000)
    private String commonQuestions;

    @Column(length = 1500)
    private String tips;
}
