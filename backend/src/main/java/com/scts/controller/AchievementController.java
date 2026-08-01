package com.scts.controller;

import com.scts.dto.AchievementDTO;
import com.scts.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    @Autowired
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AchievementDTO>> getStudentAchievements(@PathVariable Long studentId) {
        return ResponseEntity.ok(achievementService.getStudentAchievements(studentId));
    }

    @PostMapping
    public ResponseEntity<AchievementDTO> createAchievement(@RequestBody AchievementDTO dto) {
        return ResponseEntity.ok(achievementService.createAchievement(dto));
    }
}
