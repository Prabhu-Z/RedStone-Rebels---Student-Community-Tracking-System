package com.scts.dto;

import java.time.LocalDate;

public class ActivityDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long communityId;
    private String communityName;
    private Long eventId;
    private String eventTitle;
    private String activityType;
    private String role;
    private String contribution;
    private LocalDate activityDate;
    private String description;

    public ActivityDTO() {}

    public ActivityDTO(Long id, Long studentId, String studentName, Long communityId, String communityName, Long eventId, String eventTitle, String activityType, String role, String contribution, LocalDate activityDate, String description) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.communityId = communityId;
        this.communityName = communityName;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.activityType = activityType;
        this.role = role;
        this.contribution = contribution;
        this.activityDate = activityDate;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }
    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getContribution() { return contribution; }
    public void setContribution(String contribution) { this.contribution = contribution; }
    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static ActivityDTOBuilder builder() { return new ActivityDTOBuilder(); }

    public static class ActivityDTOBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private Long communityId;
        private String communityName;
        private Long eventId;
        private String eventTitle;
        private String activityType;
        private String role;
        private String contribution;
        private LocalDate activityDate;
        private String description;

        public ActivityDTOBuilder id(Long id) { this.id = id; return this; }
        public ActivityDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public ActivityDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public ActivityDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public ActivityDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public ActivityDTOBuilder eventId(Long eventId) { this.eventId = eventId; return this; }
        public ActivityDTOBuilder eventTitle(String eventTitle) { this.eventTitle = eventTitle; return this; }
        public ActivityDTOBuilder activityType(String activityType) { this.activityType = activityType; return this; }
        public ActivityDTOBuilder role(String role) { this.role = role; return this; }
        public ActivityDTOBuilder contribution(String contribution) { this.contribution = contribution; return this; }
        public ActivityDTOBuilder activityDate(LocalDate activityDate) { this.activityDate = activityDate; return this; }
        public ActivityDTOBuilder description(String description) { this.description = description; return this; }

        public ActivityDTO build() {
            return new ActivityDTO(id, studentId, studentName, communityId, communityName, eventId, eventTitle, activityType, role, contribution, activityDate, description);
        }
    }
}
