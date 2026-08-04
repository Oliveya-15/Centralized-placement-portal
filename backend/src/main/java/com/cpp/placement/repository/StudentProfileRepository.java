package com.cpp.placement.repository;

import com.cpp.placement.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    /**
     * Backs the TPO "Dynamic Master Ledger" filter bar.
     * Any parameter left null is ignored (matches everything for that field).
     */
    @Query("""
            SELECT sp FROM StudentProfile sp
            WHERE (:branch IS NULL OR LOWER(sp.branch) = LOWER(:branch))
              AND (:minCgpa IS NULL OR sp.cgpa >= :minCgpa)
              AND (:maxBacklogs IS NULL OR sp.activeBacklogs <= :maxBacklogs)
              AND (:batchYear IS NULL OR sp.batchYear = :batchYear)
              AND (:skill IS NULL OR LOWER(sp.skills) LIKE LOWER(CONCAT('%', :skill, '%')))
            """)
    List<StudentProfile> search(
            @Param("branch") String branch,
            @Param("minCgpa") Double minCgpa,
            @Param("maxBacklogs") Integer maxBacklogs,
            @Param("batchYear") Integer batchYear,
            @Param("skill") String skill
    );
}
