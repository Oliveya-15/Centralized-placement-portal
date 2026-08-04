package com.cpp.placement.repository;

import com.cpp.placement.entity.CompanyPrepGuide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyPrepGuideRepository extends JpaRepository<CompanyPrepGuide, Long> {
    Optional<CompanyPrepGuide> findByCompanyNameIgnoreCase(String companyName);
}
