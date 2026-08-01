package com.scts.controller;

import com.scts.dto.VolunteerHourDTO;
import com.scts.service.VolunteerHourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/volunteer-hours")
public class VolunteerHourController {

    private final VolunteerHourService volunteerHourService;

    @Autowired
    public VolunteerHourController(VolunteerHourService volunteerHourService) {
        this.volunteerHourService = volunteerHourService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<VolunteerHourDTO>> getPendingHours() {
        return ResponseEntity.ok(volunteerHourService.getPendingHours());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<VolunteerHourDTO>> getStudentHours(@PathVariable Long studentId) {
        return ResponseEntity.ok(volunteerHourService.getStudentVolunteerHours(studentId));
    }

    @PostMapping
    public ResponseEntity<VolunteerHourDTO> logHours(@RequestBody VolunteerHourDTO dto) {
        return ResponseEntity.ok(volunteerHourService.logVolunteerHours(dto));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<VolunteerHourDTO> verifyHours(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(volunteerHourService.verifyVolunteerHours(id, status));
    }
}
