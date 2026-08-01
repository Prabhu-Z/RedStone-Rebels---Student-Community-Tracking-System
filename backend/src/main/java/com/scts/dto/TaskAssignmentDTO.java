package com.scts.dto;

import java.time.LocalDateTime;

public class TaskAssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private String targetYear;
    private String deadline;
    private String status;
    private String taskType; // "COMMUNITY_TASK" vs "DAILY_TASK"
    private String assignedByFacultyName;
    private Long communityId;
    private String communityName;
    private LocalDateTime createdAt;
    private int assignedStudentCount;
    private int verifiedStudentCount;

    public TaskAssignmentDTO() {}

    public TaskAssignmentDTO(Long id, String title, String description, String targetYear, String deadline, String status, String taskType, String assignedByFacultyName, Long communityId, String communityName, LocalDateTime createdAt, int assignedStudentCount, int verifiedStudentCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.targetYear = targetYear;
        this.deadline = deadline;
        this.status = status;
        this.taskType = taskType;
        this.assignedByFacultyName = assignedByFacultyName;
        this.communityId = communityId;
        this.communityName = communityName;
        this.createdAt = createdAt;
        this.assignedStudentCount = assignedStudentCount;
        this.verifiedStudentCount = verifiedStudentCount;
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

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getAssignedStudentCount() { return assignedStudentCount; }
    public void setAssignedStudentCount(int assignedStudentCount) { this.assignedStudentCount = assignedStudentCount; }

    public int getVerifiedStudentCount() { return verifiedStudentCount; }
    public void setVerifiedStudentCount(int verifiedStudentCount) { this.verifiedStudentCount = verifiedStudentCount; }

    public static TaskAssignmentDTOBuilder builder() { return new TaskAssignmentDTOBuilder(); }

    public static class TaskAssignmentDTOBuilder {
        private Long id;
        private String title;
        private String description;
        private String targetYear;
        private String deadline;
        private String status;
        private String taskType;
        private String assignedByFacultyName;
        private Long communityId;
        private String communityName;
        private LocalDateTime createdAt;
        private int assignedStudentCount;
        private int verifiedStudentCount;

        public TaskAssignmentDTOBuilder id(Long id) { this.id = id; return this; }
        public TaskAssignmentDTOBuilder title(String title) { this.title = title; return this; }
        public TaskAssignmentDTOBuilder description(String description) { this.description = description; return this; }
        public TaskAssignmentDTOBuilder targetYear(String targetYear) { this.targetYear = targetYear; return this; }
        public TaskAssignmentDTOBuilder deadline(String deadline) { this.deadline = deadline; return this; }
        public TaskAssignmentDTOBuilder status(String status) { this.status = status; return this; }
        public TaskAssignmentDTOBuilder taskType(String taskType) { this.taskType = taskType; return this; }
        public TaskAssignmentDTOBuilder assignedByFacultyName(String assignedByFacultyName) { this.assignedByFacultyName = assignedByFacultyName; return this; }
        public TaskAssignmentDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public TaskAssignmentDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public TaskAssignmentDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TaskAssignmentDTOBuilder assignedStudentCount(int assignedStudentCount) { this.assignedStudentCount = assignedStudentCount; return this; }
        public TaskAssignmentDTOBuilder verifiedStudentCount(int verifiedStudentCount) { this.verifiedStudentCount = verifiedStudentCount; return this; }

        public TaskAssignmentDTO build() {
            return new TaskAssignmentDTO(id, title, description, targetYear, deadline, status, taskType, assignedByFacultyName, communityId, communityName, createdAt, assignedStudentCount, verifiedStudentCount);
        }
    }
}
