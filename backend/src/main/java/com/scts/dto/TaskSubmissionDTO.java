package com.scts.dto;

import java.time.LocalDateTime;

public class TaskSubmissionDTO {
    private Long id;
    private Long taskAssignmentId;
    private String taskTitle;
    private String taskDescription;
    private String targetYear;
    private String deadline;
    private String communityName;
    private String taskType; // "COMMUNITY_TASK" vs "DAILY_TASK"
    private Long studentId;
    private String studentName;
    private String studentCode;
    private String proofLink;
    private String proofFileName;
    private String proofFileUrl;
    private String status;
    private String rejectionReason;
    private LocalDateTime submittedAt;

    public TaskSubmissionDTO() {}

    public TaskSubmissionDTO(Long id, Long taskAssignmentId, String taskTitle, String taskDescription, String targetYear, String deadline, String communityName, String taskType, Long studentId, String studentName, String studentCode, String proofLink, String proofFileName, String proofFileUrl, String status, String rejectionReason, LocalDateTime submittedAt) {
        this.id = id;
        this.taskAssignmentId = taskAssignmentId;
        this.taskTitle = taskTitle;
        this.taskDescription = taskDescription;
        this.targetYear = targetYear;
        this.deadline = deadline;
        this.communityName = communityName;
        this.taskType = taskType;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.proofLink = proofLink;
        this.proofFileName = proofFileName;
        this.proofFileUrl = proofFileUrl;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTaskAssignmentId() { return taskAssignmentId; }
    public void setTaskAssignmentId(Long taskAssignmentId) { this.taskAssignmentId = taskAssignmentId; }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }

    public String getTaskDescription() { return taskDescription; }
    public void setTaskDescription(String taskDescription) { this.taskDescription = taskDescription; }

    public String getTargetYear() { return targetYear; }
    public void setTargetYear(String targetYear) { this.targetYear = targetYear; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getProofLink() { return proofLink; }
    public void setProofLink(String proofLink) { this.proofLink = proofLink; }

    public String getProofFileName() { return proofFileName; }
    public void setProofFileName(String proofFileName) { this.proofFileName = proofFileName; }

    public String getProofFileUrl() { return proofFileUrl; }
    public void setProofFileUrl(String proofFileUrl) { this.proofFileUrl = proofFileUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public static TaskSubmissionDTOBuilder builder() { return new TaskSubmissionDTOBuilder(); }

    public static class TaskSubmissionDTOBuilder {
        private Long id;
        private Long taskAssignmentId;
        private String taskTitle;
        private String taskDescription;
        private String targetYear;
        private String deadline;
        private String communityName;
        private String taskType;
        private Long studentId;
        private String studentName;
        private String studentCode;
        private String proofLink;
        private String proofFileName;
        private String proofFileUrl;
        private String status;
        private String rejectionReason;
        private LocalDateTime submittedAt;

        public TaskSubmissionDTOBuilder id(Long id) { this.id = id; return this; }
        public TaskSubmissionDTOBuilder taskAssignmentId(Long taskAssignmentId) { this.taskAssignmentId = taskAssignmentId; return this; }
        public TaskSubmissionDTOBuilder taskTitle(String taskTitle) { this.taskTitle = taskTitle; return this; }
        public TaskSubmissionDTOBuilder taskDescription(String taskDescription) { this.taskDescription = taskDescription; return this; }
        public TaskSubmissionDTOBuilder targetYear(String targetYear) { this.targetYear = targetYear; return this; }
        public TaskSubmissionDTOBuilder deadline(String deadline) { this.deadline = deadline; return this; }
        public TaskSubmissionDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public TaskSubmissionDTOBuilder taskType(String taskType) { this.taskType = taskType; return this; }
        public TaskSubmissionDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public TaskSubmissionDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public TaskSubmissionDTOBuilder studentCode(String studentCode) { this.studentCode = studentCode; return this; }
        public TaskSubmissionDTOBuilder proofLink(String proofLink) { this.proofLink = proofLink; return this; }
        public TaskSubmissionDTOBuilder proofFileName(String proofFileName) { this.proofFileName = proofFileName; return this; }
        public TaskSubmissionDTOBuilder proofFileUrl(String proofFileUrl) { this.proofFileUrl = proofFileUrl; return this; }
        public TaskSubmissionDTOBuilder status(String status) { this.status = status; return this; }
        public TaskSubmissionDTOBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public TaskSubmissionDTOBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }

        public TaskSubmissionDTO build() {
            return new TaskSubmissionDTO(id, taskAssignmentId, taskTitle, taskDescription, targetYear, deadline, communityName, taskType, studentId, studentName, studentCode, proofLink, proofFileName, proofFileUrl, status, rejectionReason, submittedAt);
        }
    }
}
