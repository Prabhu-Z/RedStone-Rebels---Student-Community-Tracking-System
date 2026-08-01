package com.scts.controller;

import com.scts.dto.CommunityAnalyticsDTO;
import com.scts.dto.DashboardDTOs.*;
import com.scts.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentDashboard> getStudentDashboard(@PathVariable Long studentId) {
        return ResponseEntity.ok(dashboardService.getStudentDashboard(studentId));
    }

    @GetMapping("/coordinator/{communityId}")
    public ResponseEntity<CoordinatorDashboard> getCoordinatorDashboard(@PathVariable Long communityId) {
        return ResponseEntity.ok(dashboardService.getCoordinatorDashboard(communityId));
    }

    @GetMapping("/coordinator/user/{userId}")
    public ResponseEntity<CoordinatorDashboard> getCoordinatorDashboardByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getCoordinatorDashboardByUserId(userId));
    }

    @GetMapping("/faculty")
    public ResponseEntity<FacultyDashboard> getFacultyDashboard() {
        return ResponseEntity.ok(dashboardService.getFacultyDashboard());
    }

    @GetMapping("/community-analytics/{communityId}")
    public ResponseEntity<CommunityAnalyticsDTO> getCommunityAnalytics(@PathVariable Long communityId) {
        return ResponseEntity.ok(dashboardService.getCommunityAnalytics(communityId));
    }
}
