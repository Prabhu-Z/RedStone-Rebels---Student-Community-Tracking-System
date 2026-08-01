package com.scts.service;

import com.scts.dto.*;
import com.scts.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    private final StudentService studentService;
    private final CommunityService communityService;
    private final EventService eventService;

    @Autowired
    public ReportService(StudentService studentService, CommunityService communityService, EventService eventService) {
        this.studentService = studentService;
        this.communityService = communityService;
        this.eventService = eventService;
    }

    public Map<String, Object> generateStudentReport(Long studentId) {
        StudentDTO student = studentService.getStudentById(studentId);
        Map<String, Object> report = new HashMap<>();
        report.put("reportTitle", "Official Student Extracurricular Transcript");
        report.put("generatedAt", java.time.LocalDateTime.now().toString());
        report.put("student", student);
        report.put("memberships", student.getMemberships());
        report.put("activities", student.getActivities());
        report.put("achievements", student.getAchievements());
        report.put("certificates", student.getCertificates());
        report.put("summary", Map.of(
                "totalCommunities", student.getTotalCommunitiesJoined(),
                "attendanceRate", student.getAttendancePercentage() + "%",
                "volunteerHours", student.getTotalVolunteerHours(),
                "achievementsCount", student.getTotalAchievements()
        ));
        return report;
    }

    public Map<String, Object> generateCommunityReport(Long communityId) {
        CommunityDTO community = communityService.getCommunityById(communityId);
        Map<String, Object> report = new HashMap<>();
        report.put("reportTitle", "Annual Community Performance Report");
        report.put("generatedAt", java.time.LocalDateTime.now().toString());
        report.put("community", community);
        report.put("memberCount", community.getMemberCount());
        report.put("upcomingEvents", community.getUpcomingEventCount());
        return report;
    }
}
