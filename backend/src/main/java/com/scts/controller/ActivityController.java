package com.scts.controller;

import com.scts.dto.ActivityDTO;
import com.scts.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ActivityDTO>> getStudentActivities(@PathVariable Long studentId) {
        return ResponseEntity.ok(activityService.getStudentActivities(studentId));
    }

    @PostMapping
    public ResponseEntity<ActivityDTO> createActivity(@RequestBody ActivityDTO dto) {
        return ResponseEntity.ok(activityService.createActivity(dto));
    }
}
