package com.scts.controller;

import com.scts.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudentReport(@PathVariable Long studentId) {
        return ResponseEntity.ok(reportService.generateStudentReport(studentId));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<Map<String, Object>> getCommunityReport(@PathVariable Long communityId) {
        return ResponseEntity.ok(reportService.generateCommunityReport(communityId));
    }
}
