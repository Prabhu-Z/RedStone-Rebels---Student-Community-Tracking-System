package com.scts.dto;

import java.time.LocalDateTime;

public class ActivityRequestDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private String department;
    private Long communityId;
    private String communityName;
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

    public ActivityRequestDTO() {}

    public ActivityRequestDTO(Long id, Long studentId, String studentName, String studentCode, String department, Long communityId, String communityName, String title, String category, String description, String proofLink, String proofFileName, Integer requestedPoints, Integer grantedPoints, String status, String coordinatorFeedback, LocalDateTime createdAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.department = department;
        this.communityId = communityId;
        this.communityName = communityName;
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
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

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

    public static ActivityRequestDTOBuilder builder() { return new ActivityRequestDTOBuilder(); }

    public static class ActivityRequestDTOBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private String studentCode;
        private String department;
        private Long communityId;
        private String communityName;
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

        public ActivityRequestDTOBuilder id(Long id) { this.id = id; return this; }
        public ActivityRequestDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public ActivityRequestDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public ActivityRequestDTOBuilder studentCode(String studentCode) { this.studentCode = studentCode; return this; }
        public ActivityRequestDTOBuilder department(String department) { this.department = department; return this; }
        public ActivityRequestDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public ActivityRequestDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public ActivityRequestDTOBuilder title(String title) { this.title = title; return this; }
        public ActivityRequestDTOBuilder category(String category) { this.category = category; return this; }
        public ActivityRequestDTOBuilder description(String description) { this.description = description; return this; }
        public ActivityRequestDTOBuilder proofLink(String proofLink) { this.proofLink = proofLink; return this; }
        public ActivityRequestDTOBuilder proofFileName(String proofFileName) { this.proofFileName = proofFileName; return this; }
        public ActivityRequestDTOBuilder requestedPoints(Integer requestedPoints) { this.requestedPoints = requestedPoints; return this; }
        public ActivityRequestDTOBuilder grantedPoints(Integer grantedPoints) { this.grantedPoints = grantedPoints; return this; }
        public ActivityRequestDTOBuilder status(String status) { this.status = status; return this; }
        public ActivityRequestDTOBuilder coordinatorFeedback(String coordinatorFeedback) { this.coordinatorFeedback = coordinatorFeedback; return this; }
        public ActivityRequestDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ActivityRequestDTO build() {
            return new ActivityRequestDTO(id, studentId, studentName, studentCode, department, communityId, communityName, title, category, description, proofLink, proofFileName, requestedPoints, grantedPoints, status, coordinatorFeedback, createdAt);
        }
    }
}
