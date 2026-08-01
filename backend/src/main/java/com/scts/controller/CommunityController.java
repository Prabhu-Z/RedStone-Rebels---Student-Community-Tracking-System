package com.scts.controller;

import com.scts.dto.CommunityDTO;
import com.scts.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/communities")
public class CommunityController {

    private final CommunityService communityService;

    @Autowired
    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public ResponseEntity<List<CommunityDTO>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDTO> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getCommunityById(id));
    }

    @PostMapping
    public ResponseEntity<CommunityDTO> createCommunity(@RequestBody CommunityDTO dto) {
        return ResponseEntity.ok(communityService.createCommunity(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityDTO> updateCommunity(@PathVariable Long id, @RequestBody CommunityDTO dto) {
        return ResponseEntity.ok(communityService.updateCommunity(id, dto));
    }
}
