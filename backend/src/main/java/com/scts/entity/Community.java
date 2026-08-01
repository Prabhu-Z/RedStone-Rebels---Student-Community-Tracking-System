package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "communities")
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(name = "faculty_coordinator")
    private String facultyCoordinator;

    @Column(name = "student_coordinator")
    private String studentCoordinator;

    @Column(name = "coordinator_user_id")
    private Long coordinatorUserId;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Community() {}

    public Community(Long id, String name, String description, String category, String facultyCoordinator, String studentCoordinator, Long coordinatorUserId, String status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.facultyCoordinator = facultyCoordinator;
        this.studentCoordinator = studentCoordinator;
        this.coordinatorUserId = coordinatorUserId;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFacultyCoordinator() { return facultyCoordinator; }
    public void setFacultyCoordinator(String facultyCoordinator) { this.facultyCoordinator = facultyCoordinator; }
    public String getStudentCoordinator() { return studentCoordinator; }
    public void setStudentCoordinator(String studentCoordinator) { this.studentCoordinator = studentCoordinator; }
    public Long getCoordinatorUserId() { return coordinatorUserId; }
    public void setCoordinatorUserId(Long coordinatorUserId) { this.coordinatorUserId = coordinatorUserId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static CommunityBuilder builder() { return new CommunityBuilder(); }

    public static class CommunityBuilder {
        private Long id;
        private String name;
        private String description;
        private String category;
        private String facultyCoordinator;
        private String studentCoordinator;
        private Long coordinatorUserId;
        private String status;
        private LocalDateTime createdAt;

        public CommunityBuilder id(Long id) { this.id = id; return this; }
        public CommunityBuilder name(String name) { this.name = name; return this; }
        public CommunityBuilder description(String description) { this.description = description; return this; }
        public CommunityBuilder category(String category) { this.category = category; return this; }
        public CommunityBuilder facultyCoordinator(String facultyCoordinator) { this.facultyCoordinator = facultyCoordinator; return this; }
        public CommunityBuilder studentCoordinator(String studentCoordinator) { this.studentCoordinator = studentCoordinator; return this; }
        public CommunityBuilder coordinatorUserId(Long coordinatorUserId) { this.coordinatorUserId = coordinatorUserId; return this; }
        public CommunityBuilder status(String status) { this.status = status; return this; }
        public CommunityBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Community build() {
            return new Community(id, name, description, category, facultyCoordinator, studentCoordinator, coordinatorUserId, status, createdAt);
        }
    }
}
