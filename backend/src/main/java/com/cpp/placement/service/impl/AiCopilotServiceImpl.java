package com.cpp.placement.service.impl;

import com.cpp.placement.dto.response.AiPrepResponse;
import com.cpp.placement.dto.response.FitScoreResponse;
import com.cpp.placement.entity.CompanyPrepGuide;
import com.cpp.placement.entity.Job;
import com.cpp.placement.entity.StudentProfile;
import com.cpp.placement.exception.ResourceNotFoundException;
import com.cpp.placement.repository.CompanyPrepGuideRepository;
import com.cpp.placement.repository.JobRepository;
import com.cpp.placement.repository.StudentProfileRepository;
import com.cpp.placement.service.AiCopilotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * This is the "AI Placement Copilot" described in the concept doc:
 *  - Company Process Mapping
 *  - Tailored Q&A Compilations
 *  - Predictive Capability (fit-score) Metrics
 *
 * It ships as a transparent, deterministic rule engine so the project works
 * fully offline with zero API keys. To upgrade this to a generative LLM:
 *   1. Keep the AiCopilotService interface and DTOs unchanged.
 *   2. In getPrepGuide()/getFitScore(), call your model provider instead of
 *      (or in addition to) the template/scoring logic below.
 *   3. Everything downstream (controller, React UI) keeps working as-is.
 */
@Service
@RequiredArgsConstructor
public class AiCopilotServiceImpl implements AiCopilotService {

    private final CompanyPrepGuideRepository prepGuideRepository;
    private final JobRepository jobRepository;
    private final StudentProfileRepository studentProfileRepository;

    @Override
    public AiPrepResponse getPrepGuide(String companyName) {
        return prepGuideRepository.findByCompanyNameIgnoreCase(companyName)
                .map(guide -> new AiPrepResponse(
                        guide.getCompanyName(),
                        guide.getRoundsBreakdown(),
                        guide.getCommonQuestions(),
                        guide.getTips(),
                        false))
                .orElseGet(() -> generateGenericGuide(companyName));
    }

    @Override
    public FitScoreResponse getFitScore(Long studentId, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Complete your profile to see a fit score"));

        int score = 0;
        List<String> matched = new ArrayList<>();
        List<String> gaps = new ArrayList<>();

        // CGPA - 30 points
        if (job.getMinCgpa() == null) {
            score += 30;
        } else if (profile.getCgpa() != null && profile.getCgpa() >= job.getMinCgpa()) {
            score += 30;
            matched.add("Your CGPA of " + profile.getCgpa() + " clears the " + job.getMinCgpa() + " cutoff");
        } else {
            gaps.add("CGPA is below the " + job.getMinCgpa() + " cutoff for this role");
        }

        // Backlogs - 15 points
        int backlogs = profile.getActiveBacklogs() == null ? 0 : profile.getActiveBacklogs();
        if (job.getMaxBacklogs() == null || backlogs <= job.getMaxBacklogs()) {
            score += 15;
            matched.add("Your active backlog count is within the allowed limit");
        } else {
            gaps.add("You have more active backlogs than this role allows");
        }

        // Branch - 15 points
        if (job.getEligibleBranches() == null || job.getEligibleBranches().isBlank()) {
            score += 15;
        } else {
            String branch = profile.getBranch() == null ? "" : profile.getBranch().trim().toLowerCase();
            boolean branchOk = Arrays.stream(job.getEligibleBranches().split(","))
                    .map(String::trim).map(String::toLowerCase)
                    .anyMatch(b -> b.equals(branch));
            if (branchOk) {
                score += 15;
                matched.add("Your branch (" + profile.getBranch() + ") is eligible");
            } else {
                gaps.add("This role targets branches: " + job.getEligibleBranches());
            }
        }

        // Skills overlap - 40 points, proportional
        if (job.getRequiredSkills() == null || job.getRequiredSkills().isBlank()) {
            score += 40;
        } else {
            Set<String> required = splitSkills(job.getRequiredSkills());
            Set<String> owned = splitSkills(profile.getSkills());
            long overlap = required.stream().filter(owned::contains).count();
            int skillPoints = required.isEmpty() ? 40 : (int) Math.round(40.0 * overlap / required.size());
            score += skillPoints;

            if (overlap > 0) {
                matched.add(overlap + " of " + required.size() + " required skills found on your profile");
            }
            List<String> missing = required.stream().filter(s -> !owned.contains(s)).collect(Collectors.toList());
            if (!missing.isEmpty()) {
                gaps.add("Consider building: " + String.join(", ", missing));
            }
        }

        return new FitScoreResponse(job.getId(), job.getCompanyName(), Math.min(score, 100), matched, gaps);
    }

    private Set<String> splitSkills(String csv) {
        if (csv == null || csv.isBlank()) return Set.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    private AiPrepResponse generateGenericGuide(String companyName) {
        String rounds = "Round 1: Online Aptitude & Reasoning Test -> "
                + "Round 2: Technical/Coding Round (DSA + core CS fundamentals) -> "
                + "Round 3: Technical Interview (project deep-dive + problem solving) -> "
                + "Round 4: HR / Managerial Round (culture fit, background, expectations)";

        String questions = "Tell me about yourself. | Walk me through a project on your resume. | "
                + "Explain a data structure you'd use to solve a scheduling problem and why. | "
                + "Why do you want to join " + companyName + "? | "
                + "Describe a time you handled conflicting priorities or a tight deadline.";

        String tips = "Revise fundamentals (arrays, strings, trees, graphs, OOP, DBMS, OS basics). "
                + "Research " + companyName + "'s recent products/news for the HR round. "
                + "Practice explaining your resume projects out loud in under 2 minutes each.";

        return new AiPrepResponse(companyName, rounds, questions, tips, true);
    }
}
