package com.scts.controller;

import com.scts.dto.AuthDTOs.*;
import com.scts.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String email) {
        boolean exists = authService.checkEmailExists(email);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<MessageResponse> sendOtp(@Valid @RequestBody SendOtpRequest sendOtpRequest) {
        return ResponseEntity.ok(authService.sendOtp(sendOtpRequest));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<JwtResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyOtpRequest) {
        return ResponseEntity.ok(authService.verifyOtp(verifyOtpRequest));
    }

    @PostMapping("/google")
    public ResponseEntity<JwtResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest googleLoginRequest) {
        return ResponseEntity.ok(authService.googleLogin(googleLoginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }
}
