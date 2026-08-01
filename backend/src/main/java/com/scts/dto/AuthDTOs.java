package com.scts.dto;

import com.scts.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuthDTOs {

    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SendOtpRequest {
        @NotBlank
        @Email
        private String email;

        public SendOtpRequest() {}
        public SendOtpRequest(String email) { this.email = email; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class VerifyOtpRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String code;

        public VerifyOtpRequest() {}
        public VerifyOtpRequest(String email, String code) {
            this.email = email;
            this.code = code;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class GoogleLoginRequest {
        @NotBlank
        @Email
        private String email;
        private String name;
        private String idToken;
        private String picture;

        public GoogleLoginRequest() {}

        public GoogleLoginRequest(String email, String name, String idToken, String picture) {
            this.email = email;
            this.name = name;
            this.idToken = idToken;
            this.picture = picture;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIdToken() { return idToken; }
        public void setIdToken(String idToken) { this.idToken = idToken; }
        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }
    }

    public static class RegisterRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;

        @NotBlank
        private String name;

        @NotNull
        private Role role;

        private String studentCode;
        private String department;
        private String degree;
        private Integer year;
        private Integer semester;
        private String contact;

        public RegisterRequest() {}

        public RegisterRequest(String email, String password, String name, Role role, String studentCode, String department, String degree, Integer year, Integer semester, String contact) {
            this.email = email;
            this.password = password;
            this.name = name;
            this.role = role;
            this.studentCode = studentCode;
            this.department = department;
            this.degree = degree;
            this.year = year;
            this.semester = semester;
            this.contact = contact;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public String getStudentCode() { return studentCode; }
        public void setStudentCode(String studentCode) { this.studentCode = studentCode; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer semester) { this.semester = semester; }
        public String getContact() { return contact; }
        public void setContact(String contact) { this.contact = contact; }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String name;
        private Role role;
        private Long studentId;

        public JwtResponse() {}

        public JwtResponse(String token, String type, Long id, String email, String name, Role role, Long studentId) {
            this.token = token;
            this.type = type != null ? type : "Bearer";
            this.id = id;
            this.email = email;
            this.name = name;
            this.role = role;
            this.studentId = studentId;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public static JwtResponseBuilder builder() { return new JwtResponseBuilder(); }

        public static class JwtResponseBuilder {
            private String token;
            private String type = "Bearer";
            private Long id;
            private String email;
            private String name;
            private Role role;
            private Long studentId;

            public JwtResponseBuilder token(String token) { this.token = token; return this; }
            public JwtResponseBuilder type(String type) { this.type = type; return this; }
            public JwtResponseBuilder id(Long id) { this.id = id; return this; }
            public JwtResponseBuilder email(String email) { this.email = email; return this; }
            public JwtResponseBuilder name(String name) { this.name = name; return this; }
            public JwtResponseBuilder role(Role role) { this.role = role; return this; }
            public JwtResponseBuilder studentId(Long studentId) { this.studentId = studentId; return this; }

            public JwtResponse build() {
                return new JwtResponse(token, type, id, email, name, role, studentId);
            }
        }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse() {}
        public MessageResponse(String message) { this.message = message; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
