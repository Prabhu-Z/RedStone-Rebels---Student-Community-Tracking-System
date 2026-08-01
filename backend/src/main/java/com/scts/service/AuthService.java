package com.scts.service;

import com.scts.dto.AuthDTOs.*;
import com.scts.entity.*;
import com.scts.exception.BadRequestException;
import com.scts.repository.*;
import com.scts.security.JwtUtils;
import com.scts.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    // In-memory OTP storage map: Email -> 6-digit Code
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Autowired
    public AuthService(UserRepository userRepository, StudentRepository studentRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public boolean checkEmailExists(String email) {
        if (email == null) return false;
        return userRepository.existsByEmail(email.trim().toLowerCase());
    }

    public JwtResponse login(LoginRequest request) {
        if (!checkEmailExists(request.getEmail())) {
            throw new BadRequestException("Account with email '" + request.getEmail() + "' does not exist. Please register first!");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        Long studentId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        return JwtResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .name(userDetails.getUsername())
                .role(user.getRole())
                .studentId(studentId)
                .build();
    }

    public MessageResponse sendOtp(SendOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        // Generate a 6-digit numeric verification code
        String code = String.format("%06d", new Random().nextInt(900000) + 100000);
        otpStore.put(email, code);

        System.out.println("==========================================");
        System.out.println("SCTS EMAIL VERIFICATION OTP CODE FOR " + email + ": " + code);
        System.out.println("==========================================");

        return new MessageResponse("Verification code " + code + " sent to " + email);
    }

    @Transactional
    public JwtResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String code = request.getCode().trim();

        String storedCode = otpStore.get(email);

        // Allow matching stored OTP code OR master verification code 849204
        if (storedCode == null || (!storedCode.equals(code) && !"849204".equals(code))) {
            throw new BadRequestException("Invalid or expired email verification code.");
        }

        // Clear used code
        otpStore.remove(email);

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Register new Verified Email Student User automatically
            user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode("OTP_VERIFIED_" + System.currentTimeMillis()))
                    .role(Role.ROLE_STUDENT)
                    .status("ACTIVE")
                    .build();

            userRepository.save(user);

            String studentCode = "VERIFIED_" + (System.currentTimeMillis() % 1000000);
            String name = email.split("@")[0];

            Student student = Student.builder()
                    .user(user)
                    .studentCode(studentCode)
                    .name(name.substring(0, 1).toUpperCase() + name.substring(1))
                    .department("Computer Science")
                    .degree("B.Tech")
                    .year(1)
                    .semester(1)
                    .build();

            studentRepository.save(student);
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Long studentId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        String displayName = user.getEmail();
        if (user.getRole() == Role.ROLE_STUDENT) {
            displayName = studentRepository.findByUserId(user.getId()).map(Student::getName).orElse(user.getEmail());
        }

        return JwtResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .name(displayName)
                .role(user.getRole())
                .studentId(studentId)
                .build();
    }

    @Transactional
    public JwtResponse googleLogin(GoogleLoginRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(cleanEmail).orElse(null);

        if (user == null) {
            user = User.builder()
                    .email(cleanEmail)
                    .password(passwordEncoder.encode("GOOGLE_OAUTH_" + System.currentTimeMillis()))
                    .role(Role.ROLE_STUDENT)
                    .status("ACTIVE")
                    .build();

            userRepository.save(user);

            String code = "GOOGLE_" + (System.currentTimeMillis() % 1000000);
            String displayName = request.getName() != null ? request.getName() : cleanEmail.split("@")[0];

            Student student = Student.builder()
                    .user(user)
                    .studentCode(code)
                    .name(displayName)
                    .department("Computer Science")
                    .degree("B.Tech")
                    .year(1)
                    .semester(1)
                    .build();

            studentRepository.save(student);
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Long studentId = null;
        if (user.getRole() == Role.ROLE_STUDENT) {
            studentId = studentRepository.findByUserId(user.getId())
                    .map(Student::getId)
                    .orElse(null);
        }

        String displayName = request.getName();
        if (displayName == null && user.getRole() == Role.ROLE_STUDENT) {
            displayName = studentRepository.findByUserId(user.getId()).map(Student::getName).orElse(user.getEmail());
        }

        return JwtResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .name(displayName != null ? displayName : user.getEmail())
                .role(user.getRole())
                .studentId(studentId)
                .build();
    }

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("Email '" + cleanEmail + "' is already registered in the system!");
        }

        User user = User.builder()
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status("ACTIVE")
                .build();

        userRepository.save(user);

        if (request.getRole() == Role.ROLE_STUDENT) {
            String code = request.getStudentCode() != null ? request.getStudentCode() : "REG" + System.currentTimeMillis();
            Student student = Student.builder()
                    .user(user)
                    .studentCode(code)
                    .name(request.getName() != null ? request.getName() : "Student User")
                    .department(request.getDepartment() != null ? request.getDepartment() : "Computer Science")
                    .degree(request.getDegree() != null ? request.getDegree() : "B.Tech")
                    .year(request.getYear() != null ? request.getYear() : 1)
                    .semester(request.getSemester() != null ? request.getSemester() : 1)
                    .contact(request.getContact())
                    .build();

            studentRepository.save(student);
        }

        return new MessageResponse("User registered successfully!");
    }
}
