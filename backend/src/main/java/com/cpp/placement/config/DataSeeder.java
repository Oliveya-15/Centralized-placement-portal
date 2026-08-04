package com.cpp.placement.config;

import com.cpp.placement.entity.*;
import com.cpp.placement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds realistic demo data so the app is immediately explorable after
 * `mvn spring-boot:run` - no manual data entry required. Controlled by
 * app.seed-demo-data in application.properties. Safe to run repeatedly:
 * it only seeds when the users table is empty.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyPrepGuideRepository prepGuideRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository notificationRecipientRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed-demo-data:true}")
    private boolean seedEnabled;

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        User tpo = userRepository.save(User.builder()
                .fullName("Dr. Ananya Sharma")
                .email("tpo@cpp.edu")
                .password(passwordEncoder.encode("Tpo@1234"))
                .role(Role.TPO)
                .phone("+91-9876500000")
                .build());

        User rahul = seedStudent("Rahul Verma", "rahul@cpp.edu", "CSE2026001", "CSE", 2026,
                8.7, 0, "Java,Spring Boot,React,SQL,Git", tpo.getId());
        User priya = seedStudent("Priya Singh", "priya@cpp.edu", "IT2026014", "IT", 2026,
                7.9, 1, "Python,Django,MongoDB,REST APIs", tpo.getId());
        User arjun = seedStudent("Arjun Mehta", "arjun@cpp.edu", "ECE2026022", "ECE", 2026,
                9.1, 0, "C++,Embedded Systems,Python,DSA", tpo.getId());
        User sneha = seedStudent("Sneha Iyer", "sneha@cpp.edu", "CSE2027031", "CSE", 2027,
                6.8, 2, "JavaScript,React,Node.js,HTML,CSS", tpo.getId());

        Job wipro = jobRepository.save(Job.builder()
                .companyName("Wipro").roleTitle("Project Engineer")
                .description("Wipro is hiring Project Engineers across its enterprise application "
                        + "and cloud services teams. Fresh graduates will undergo a structured 6-month training program.")
                .jobType(JobType.FULL_TIME).location("Bengaluru / Pune")
                .ctcLpa(3.5).minCgpa(6.0).maxBacklogs(1)
                .eligibleBranches("CSE,IT,ECE")
                .requiredSkills("Java,SQL,Problem Solving")
                .roundsBreakdown("Round 1: Aptitude Test -> Round 2: Pseudo-code Analysis -> "
                        + "Round 3: Technical Interview -> Round 4: HR Evaluation")
                .applicationDeadline(LocalDate.now().plusDays(21))
                .status(JobStatus.OPEN).postedByTpoId(tpo.getId()).build());

        Job tcs = jobRepository.save(Job.builder()
                .companyName("TCS").roleTitle("Systems Engineer")
                .description("TCS Systems Engineers work across banking, retail and healthcare client "
                        + "engagements after completing TCS's initial learning program (iLP).")
                .jobType(JobType.FULL_TIME).location("Multiple Locations")
                .ctcLpa(3.6).minCgpa(6.0).maxBacklogs(2)
                .eligibleBranches("CSE,IT,ECE,MECH,EEE")
                .requiredSkills("Java,Python,Communication")
                .roundsBreakdown("Round 1: TCS NQT (Verbal, Reasoning, Quant, Coding) -> "
                        + "Round 2: Technical Interview -> Round 3: HR Interview")
                .applicationDeadline(LocalDate.now().plusDays(18))
                .status(JobStatus.OPEN).postedByTpoId(tpo.getId()).build());

        Job google = jobRepository.save(Job.builder()
                .companyName("Google").roleTitle("Software Engineering Intern")
                .description("A 6-month internship building production features on a core Google product "
                        + "team, with a return-offer track for full-time SWE roles.")
                .jobType(JobType.INTERNSHIP).location("Hyderabad / Remote")
                .ctcLpa(12.0).minCgpa(8.5).maxBacklogs(0)
                .eligibleBranches("CSE,IT")
                .requiredSkills("DSA,System Design,Python,Java")
                .roundsBreakdown("Round 1: Online Coding Assessment -> Round 2: Technical Interview 1 (DSA) -> "
                        + "Round 3: Technical Interview 2 (Problem Solving) -> Round 4: Googleyness & Leadership")
                .applicationDeadline(LocalDate.now().plusDays(30))
                .status(JobStatus.OPEN).postedByTpoId(tpo.getId()).build());

        Job accenture = jobRepository.save(Job.builder()
                .companyName("Accenture").roleTitle("Associate Software Engineer")
                .description("Build and maintain cloud-native applications for global clients as part of "
                        + "Accenture's Technology practice.")
                .jobType(JobType.FULL_TIME).location("Bengaluru / Chennai")
                .ctcLpa(4.5).minCgpa(6.5).maxBacklogs(1)
                .eligibleBranches("CSE,IT,ECE,MECH")
                .requiredSkills("Cloud,Java,Communication")
                .roundsBreakdown("Round 1: Cognitive & Technical Assessment -> Round 2: Coding Round -> "
                        + "Round 3: Technical Interview -> Round 4: HR Interview")
                .applicationDeadline(LocalDate.now().plusDays(25))
                .status(JobStatus.OPEN).postedByTpoId(tpo.getId()).build());

        Job infosys = jobRepository.save(Job.builder()
                .companyName("Infosys").roleTitle("Systems Engineer")
                .description("Infosys Systems Engineers are trained at the Mysuru campus before being "
                        + "deployed onto client delivery projects across verticals.")
                .jobType(JobType.FULL_TIME).location("Mysuru / Pan India")
                .ctcLpa(3.6).minCgpa(6.0).maxBacklogs(1)
                .eligibleBranches("CSE,IT,ECE,EEE")
                .requiredSkills("Java,DBMS,Aptitude")
                .roundsBreakdown("Round 1: InfyTQ Assessment -> Round 2: Technical Interview -> Round 3: HR Interview")
                .applicationDeadline(LocalDate.now().plusDays(15))
                .status(JobStatus.OPEN).postedByTpoId(tpo.getId()).build());

        // ---- AI Copilot prep guides ----
        prepGuideRepository.saveAll(List.of(
                CompanyPrepGuide.builder().companyName("Wipro")
                        .roundsBreakdown(wipro.getRoundsBreakdown())
                        .commonQuestions("Explain OOP concepts with examples. | Write pseudo-code to reverse a "
                                + "linked list. | What is normalization in DBMS? | Why do you want to join Wipro?")
                        .tips("Focus on pseudo-code clarity over syntax in Round 2 - graders look for logic. "
                                + "Keep HR answers structured: situation, action, result.")
                        .build(),
                CompanyPrepGuide.builder().companyName("TCS")
                        .roundsBreakdown(tcs.getRoundsBreakdown())
                        .commonQuestions("Solve a basic DP problem. | Explain the SDLC. | Tell me about a "
                                + "challenging academic project. | What do you know about TCS iLP?")
                        .tips("TCS NQT weighs verbal ability heavily - don't neglect it while prepping coding.")
                        .build(),
                CompanyPrepGuide.builder().companyName("Google")
                        .roundsBreakdown(google.getRoundsBreakdown())
                        .commonQuestions("Optimize a brute-force graph traversal. | Design a URL shortener at a "
                                + "high level. | Describe a time you disagreed with a teammate and how you resolved it.")
                        .tips("Think out loud, clarify constraints before coding, and discuss time/space "
                                + "complexity for every approach you mention.")
                        .build(),
                CompanyPrepGuide.builder().companyName("Accenture")
                        .roundsBreakdown(accenture.getRoundsBreakdown())
                        .commonQuestions("What is cloud computing and name its service models. | Write a query "
                                + "to find the second-highest salary. | Why consulting/IT services over product companies?")
                        .tips("Accenture's cognitive assessment includes situational judgement - answer based on "
                                + "collaboration and client-first thinking.")
                        .build(),
                CompanyPrepGuide.builder().companyName("Infosys")
                        .roundsBreakdown(infosys.getRoundsBreakdown())
                        .commonQuestions("Explain joins in SQL with examples. | What is polymorphism? | Puzzle: "
                                + "measure 4 litres using 3L and 5L jugs. | Where do you see yourself in 5 years?")
                        .tips("InfyTQ has a generous prep window - complete the official modules, they mirror the "
                                + "actual test closely.")
                        .build()
        ));

        // ---- Sample applications so the pipeline views aren't empty on first login ----
        saveApplication(rahul, wipro, ApplicationStatus.SHORTLISTED, "Strong aptitude score, moving to tech round.");
        saveApplication(priya, tcs, ApplicationStatus.APPLIED, null);
        saveApplication(arjun, google, ApplicationStatus.INTERVIEW, "Cleared both technical rounds.");
        saveApplication(sneha, tcs, ApplicationStatus.APPLIED, null);
        saveApplication(rahul, accenture, ApplicationStatus.SELECTED, "Offer released - 4.5 LPA.");

        // ---- Sample broadcast notification ----
        List<StudentProfile> targeted = studentProfileRepository.search("CSE", 6.0, null, null, null);
        Notification notification = notificationRepository.save(Notification.builder()
                .title("Wipro Registrations Open")
                .message("Wipro's on-campus drive is now open for CSE students with CGPA 6.0+. "
                        + "Apply from your dashboard before the deadline.")
                .criteriaSummary("Branch = CSE AND CGPA >= 6.0")
                .createdByTpoId(tpo.getId())
                .recipientCount(targeted.size())
                .build());
        for (StudentProfile sp : targeted) {
            notificationRecipientRepository.save(NotificationRecipient.builder()
                    .notification(notification).studentId(sp.getUser().getId()).build());
        }

        // ---- Sample message thread ----
        messageRepository.save(Message.builder().senderId(rahul.getId()).receiverId(tpo.getId())
                .content("Hi ma'am, I wanted to ask if I can also apply to Infosys after accepting the Accenture offer?")
                .isRead(true).build());
        messageRepository.save(Message.builder().senderId(tpo.getId()).receiverId(rahul.getId())
                .content("Hi Rahul, once you accept an offer you're moved to the placed list and further "
                        + "applications are closed as per policy. Congratulations on the Accenture offer!")
                .isRead(false).build());
    }

    private User seedStudent(String name, String email, String rollNumber, String branch, int batchYear,
                              double cgpa, int backlogs, String skills, Long tpoId) {
        User user = userRepository.save(User.builder()
                .fullName(name).email(email)
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT).phone("+91-9800000000")
                .build());

        studentProfileRepository.save(StudentProfile.builder()
                .user(user).rollNumber(rollNumber).branch(branch).batchYear(batchYear)
                .cgpa(cgpa).activeBacklogs(backlogs).skills(skills)
                .resumeLink("https://example.com/resumes/" + rollNumber + ".pdf")
                .bio("Final year " + branch + " student, batch of " + batchYear + ".")
                .assignedTpoId(tpoId)
                .build());

        return user;
    }

    private void saveApplication(User student, Job job, ApplicationStatus status, String notes) {
        jobApplicationRepository.save(JobApplication.builder()
                .student(student).job(job).status(status).tpoNotes(notes).build());
    }
}
