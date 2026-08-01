package com.scts.controller;

import com.scts.dto.*;
import com.scts.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final MembershipService membershipService;
    private final ActivityService activityService;
    private final VolunteerHourService volunteerHourService;
    private final AchievementService achievementService;
    private final CertificateService certificateService;

    @Autowired
    public StudentController(StudentService studentService, MembershipService membershipService, ActivityService activityService, VolunteerHourService volunteerHourService, AchievementService achievementService, CertificateService certificateService) {
        this.studentService = studentService;
        this.membershipService = membershipService;
        this.activityService = activityService;
        this.volunteerHourService = volunteerHourService;
        this.achievementService = achievementService;
        this.certificateService = certificateService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentDTO> getStudentByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getStudentByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> updateStudentProfile(@PathVariable Long id, @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.updateStudentProfile(id, dto));
    }

    @GetMapping("/{id}/communities")
    public ResponseEntity<List<MembershipDTO>> getStudentCommunities(@PathVariable Long id) {
        return ResponseEntity.ok(membershipService.getStudentMemberships(id));
    }

    @GetMapping("/{id}/activities")
    public ResponseEntity<List<ActivityDTO>> getStudentActivities(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getStudentActivities(id));
    }

    @GetMapping("/{id}/volunteer-hours")
    public ResponseEntity<List<VolunteerHourDTO>> getStudentVolunteerHours(@PathVariable Long id) {
        return ResponseEntity.ok(volunteerHourService.getStudentVolunteerHours(id));
    }

    @GetMapping("/{id}/achievements")
    public ResponseEntity<List<AchievementDTO>> getStudentAchievements(@PathVariable Long id) {
        return ResponseEntity.ok(achievementService.getStudentAchievements(id));
    }

    @GetMapping("/{id}/certificates")
    public ResponseEntity<List<CertificateDTO>> getStudentCertificates(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getStudentCertificates(id));
    }
}
