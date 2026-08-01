package com.scts.controller;

import com.scts.entity.Community;
import com.scts.entity.Role;
import com.scts.entity.User;
import com.scts.repository.CommunityRepository;
import com.scts.repository.UserRepository;
import com.scts.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, CommunityRepository communityRepository, NotificationService notificationService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.notificationService = notificationService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/coordinators")
    public ResponseEntity<List<User>> getCoordinators() {
        List<User> staffList = new ArrayList<>(userRepository.findByRole(Role.ROLE_COMMUNITY_COORDINATOR));
        staffList.addAll(userRepository.findByRole(Role.ROLE_FACULTY));
        return ResponseEntity.ok(staffList);
    }

    @PostMapping("/grant-coordinator")
    public ResponseEntity<?> grantCoordinatorAccess(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String name = (String) payload.get("name");
        Long communityId = payload.get("communityId") != null ? Long.valueOf(payload.get("communityId").toString()) : null;

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email address is required."));
        }

        email = email.trim().toLowerCase();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not registered. Please ask the user to register an account first."));
        }

        User user = optionalUser.get();
        user.setRole(Role.ROLE_COMMUNITY_COORDINATOR);
        userRepository.save(user);

        if (communityId != null) {
            Optional<Community> optionalCommunity = communityRepository.findById(communityId);
            if (optionalCommunity.isPresent()) {
                Community community = optionalCommunity.get();
                community.setCoordinatorUserId(user.getId());
                if (name != null && !name.trim().isEmpty()) {
                    community.setStudentCoordinator(name);
                } else {
                    community.setStudentCoordinator(email);
                }
                communityRepository.save(community);
            }
        }

        notificationService.createNotification(
                user.getId(),
                "Coordinator Access Granted!",
                "Faculty has granted you Community Coordinator access. You can now manage events, memberships, and activities.",
                "ROLE_CHANGE"
        );

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Successfully granted Coordinator access to " + email);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());

        return ResponseEntity.ok(response);
    }
}
