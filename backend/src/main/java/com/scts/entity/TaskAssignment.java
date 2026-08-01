package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_assignments")
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "target_year", nullable = false)
    private String targetYear; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year", "ALL"

    @Column(nullable = false)
    private String deadline; // e.g. "2026-08-15 23:59"

    @Column(nullable = false)
    private String status; // "PENDING", "ASSIGNED", "COMPLETED", "DECLINED"

    @Column(name = "task_type")
    private String taskType; // "COMMUNITY_TASK" (Faculty-originated) vs "DAILY_TASK" (Coordinator-originated)

    @Column(name = "assigned_by_faculty_name")
    private String assignedByFacultyName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TaskAssignment() {}

    public TaskAssignment(Long id, String title, String description, String targetYear, String deadline, String status, String taskType, String assignedByFacultyName, Community community, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.targetYear = targetYear;
        this.deadline = deadline;
        this.status = status;
        this.taskType = taskType;
        this.assignedByFacultyName = assignedByFacultyName;
        this.community = community;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ASSIGNED";
        }
        if (this.taskType == null) {
            this.taskType = (this.assignedByFacultyName != null && !this.assignedByFacultyName.trim().isEmpty())
                    ? "COMMUNITY_TASK"
                    : "DAILY_TASK";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetYear() { return targetYear; }
    public void setTargetYear(String targetYear) { this.targetYear = targetYear; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public String getAssignedByFacultyName() { return assignedByFacultyName; }
    public void setAssignedByFacultyName(String assignedByFacultyName) { this.assignedByFacultyName = assignedByFacultyName; }

    public Community getCommunity() { return community; }
    public void setCommunity(Community community) { this.community = community; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static TaskAssignmentBuilder builder() { return new TaskAssignmentBuilder(); }

    public static class TaskAssignmentBuilder {
        private Long id;
        private String title;
        private String description;
        private String targetYear;
        private String deadline;
        private String status;
        private String taskType;
        private String assignedByFacultyName;
        private Community community;
        private LocalDateTime createdAt;

        public TaskAssignmentBuilder id(Long id) { this.id = id; return this; }
        public TaskAssignmentBuilder title(String title) { this.title = title; return this; }
        public TaskAssignmentBuilder description(String description) { this.description = description; return this; }
        public TaskAssignmentBuilder targetYear(String targetYear) { this.targetYear = targetYear; return this; }
        public TaskAssignmentBuilder deadline(String deadline) { this.deadline = deadline; return this; }
        public TaskAssignmentBuilder status(String status) { this.status = status; return this; }
        public TaskAssignmentBuilder taskType(String taskType) { this.taskType = taskType; return this; }
        public TaskAssignmentBuilder assignedByFacultyName(String assignedByFacultyName) { this.assignedByFacultyName = assignedByFacultyName; return this; }
        public TaskAssignmentBuilder community(Community community) { this.community = community; return this; }
        public TaskAssignmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TaskAssignment build() {
            return new TaskAssignment(id, title, description, targetYear, deadline, status, taskType, assignedByFacultyName, community, createdAt);
        }
    }
}
