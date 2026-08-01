package com.scts.controller;

import com.scts.dto.ActivityRequestDTO;
import com.scts.service.ActivityRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activity-requests")
public class ActivityRequestController {

    private final ActivityRequestService activityRequestService;

    @Autowired
    public ActivityRequestController(ActivityRequestService activityRequestService) {
        this.activityRequestService = activityRequestService;
    }

    @PostMapping
    public ResponseEntity<ActivityRequestDTO> createActivityRequest(@RequestBody ActivityRequestDTO dto) {
        return ResponseEntity.ok(activityRequestService.createActivityRequest(dto));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ActivityRequestDTO>> getRequestsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(activityRequestService.getRequestsByStudent(studentId));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<ActivityRequestDTO>> getRequestsByCommunity(@PathVariable Long communityId) {
        return ResponseEntity.ok(activityRequestService.getRequestsByCommunity(communityId));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ActivityRequestDTO> approveActivityRequest(
            @PathVariable Long id,
            @RequestParam(required = false) Integer points,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(activityRequestService.approveActivityRequest(id, points, feedback));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ActivityRequestDTO> rejectActivityRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(activityRequestService.rejectActivityRequest(id, feedback));
    }
}
