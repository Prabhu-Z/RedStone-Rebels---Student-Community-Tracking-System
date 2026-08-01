package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_requests")
public class ActivityRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // e.g. HACKATHON, CERTIFICATION, RESEARCH, COMPETITION, VOLUNTEERING, OTHER

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "proof_link")
    private String proofLink;

    @Column(name = "proof_file_name")
    private String proofFileName;

    @Column(name = "requested_points")
    private Integer requestedPoints;

    @Column(name = "granted_points")
    private Integer grantedPoints;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "coordinator_feedback", columnDefinition = "TEXT")
    private String coordinatorFeedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ActivityRequest() {}

    public ActivityRequest(Long id, Student student, Community community, String title, String category, String description, String proofLink, String proofFileName, Integer requestedPoints, Integer grantedPoints, String status, String coordinatorFeedback, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.student = student;
        this.community = community;
        this.title = title;
        this.category = category;
        this.description = description;
        this.proofLink = proofLink;
        this.proofFileName = proofFileName;
        this.requestedPoints = requestedPoints;
        this.grantedPoints = grantedPoints;
        this.status = status;
        this.coordinatorFeedback = coordinatorFeedback;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.grantedPoints == null) {
            this.grantedPoints = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Community getCommunity() { return community; }
    public void setCommunity(Community community) { this.community = community; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getProofLink() { return proofLink; }
    public void setProofLink(String proofLink) { this.proofLink = proofLink; }

    public String getProofFileName() { return proofFileName; }
    public void setProofFileName(String proofFileName) { this.proofFileName = proofFileName; }

    public Integer getRequestedPoints() { return requestedPoints; }
    public void setRequestedPoints(Integer requestedPoints) { this.requestedPoints = requestedPoints; }

    public Integer getGrantedPoints() { return grantedPoints; }
    public void setGrantedPoints(Integer grantedPoints) { this.grantedPoints = grantedPoints; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCoordinatorFeedback() { return coordinatorFeedback; }
    public void setCoordinatorFeedback(String coordinatorFeedback) { this.coordinatorFeedback = coordinatorFeedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ActivityRequestBuilder builder() { return new ActivityRequestBuilder(); }

    public static class ActivityRequestBuilder {
        private Long id;
        private Student student;
        private Community community;
        private String title;
        private String category;
        private String description;
        private String proofLink;
        private String proofFileName;
        private Integer requestedPoints;
        private Integer grantedPoints;
        private String status;
        private String coordinatorFeedback;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ActivityRequestBuilder id(Long id) { this.id = id; return this; }
        public ActivityRequestBuilder student(Student student) { this.student = student; return this; }
        public ActivityRequestBuilder community(Community community) { this.community = community; return this; }
        public ActivityRequestBuilder title(String title) { this.title = title; return this; }
        public ActivityRequestBuilder category(String category) { this.category = category; return this; }
        public ActivityRequestBuilder description(String description) { this.description = description; return this; }
        public ActivityRequestBuilder proofLink(String proofLink) { this.proofLink = proofLink; return this; }
        public ActivityRequestBuilder proofFileName(String proofFileName) { this.proofFileName = proofFileName; return this; }
        public ActivityRequestBuilder requestedPoints(Integer requestedPoints) { this.requestedPoints = requestedPoints; return this; }
        public ActivityRequestBuilder grantedPoints(Integer grantedPoints) { this.grantedPoints = grantedPoints; return this; }
        public ActivityRequestBuilder status(String status) { this.status = status; return this; }
        public ActivityRequestBuilder coordinatorFeedback(String coordinatorFeedback) { this.coordinatorFeedback = coordinatorFeedback; return this; }
        public ActivityRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ActivityRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ActivityRequest build() {
            return new ActivityRequest(id, student, community, title, category, description, proofLink, proofFileName, requestedPoints, grantedPoints, status, coordinatorFeedback, createdAt, updatedAt);
        }
    }
}
