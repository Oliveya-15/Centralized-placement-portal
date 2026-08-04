package com.cpp.placement.controller;

import com.cpp.placement.dto.response.StudentProfileResponse;
import com.cpp.placement.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TPO')")
public class LedgerController {

    private final LedgerService ledgerService;

    @GetMapping
    public ResponseEntity<List<StudentProfileResponse>> search(
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) Double minCgpa,
            @RequestParam(required = false) Integer maxBacklogs,
            @RequestParam(required = false) Integer batchYear,
            @RequestParam(required = false) String skill) {
        return ResponseEntity.ok(ledgerService.search(branch, minCgpa, maxBacklogs, batchYear, skill));
    }
}
