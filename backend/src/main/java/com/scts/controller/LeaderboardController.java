package com.scts.controller;

import com.scts.dto.LeaderboardEntryDTO;
import com.scts.service.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @Autowired
    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<LeaderboardEntryDTO>> getCommunityLeaderboard(@PathVariable Long communityId) {
        return ResponseEntity.ok(leaderboardService.getCommunityLeaderboard(communityId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<LeaderboardEntryDTO>> getAllCommunitiesLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getAllCommunitiesLeaderboard());
    }
}
