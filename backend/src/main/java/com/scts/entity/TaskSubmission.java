package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_submissions")
public class TaskSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_assignment_id", nullable = false)
    private TaskAssignment taskAssignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "proof_link", columnDefinition = "TEXT")
    private String proofLink;

    @Column(name = "proof_file_name")
    private String proofFileName;

    @Column(name = "proof_file_url", columnDefinition = "TEXT")
    private String proofFileUrl;

    @Column(nullable = false)
    private String status; // "PENDING", "SUBMITTED", "VERIFIED", "REJECTED"

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    public TaskSubmission() {}

    public TaskSubmission(Long id, TaskAssignment taskAssignment, Student student, String proofLink, String proofFileName, String proofFileUrl, String status, String rejectionReason, LocalDateTime submittedAt) {
        this.id = id;
        this.taskAssignment = taskAssignment;
        this.student = student;
        this.proofLink = proofLink;
        this.proofFileName = proofFileName;
        this.proofFileUrl = proofFileUrl;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.submittedAt = submittedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = "PENDING";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TaskAssignment getTaskAssignment() { return taskAssignment; }
    public void setTaskAssignment(TaskAssignment taskAssignment) { this.taskAssignment = taskAssignment; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
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

    public static TaskSubmissionBuilder builder() { return new TaskSubmissionBuilder(); }

    public static class TaskSubmissionBuilder {
        private Long id;
        private TaskAssignment taskAssignment;
        private Student student;
        private String proofLink;
        private String proofFileName;
        private String proofFileUrl;
        private String status;
        private String rejectionReason;
        private LocalDateTime submittedAt;

        public TaskSubmissionBuilder id(Long id) { this.id = id; return this; }
        public TaskSubmissionBuilder taskAssignment(TaskAssignment taskAssignment) { this.taskAssignment = taskAssignment; return this; }
        public TaskSubmissionBuilder student(Student student) { this.student = student; return this; }
        public TaskSubmissionBuilder proofLink(String proofLink) { this.proofLink = proofLink; return this; }
        public TaskSubmissionBuilder proofFileName(String proofFileName) { this.proofFileName = proofFileName; return this; }
        public TaskSubmissionBuilder proofFileUrl(String proofFileUrl) { this.proofFileUrl = proofFileUrl; return this; }
        public TaskSubmissionBuilder status(String status) { this.status = status; return this; }
        public TaskSubmissionBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public TaskSubmissionBuilder submittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; return this; }

        public TaskSubmission build() {
            return new TaskSubmission(id, taskAssignment, student, proofLink, proofFileName, proofFileUrl, status, rejectionReason, submittedAt);
        }
    }
}
