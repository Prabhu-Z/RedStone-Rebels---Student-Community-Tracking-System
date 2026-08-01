package com.scts.dto;

import java.time.LocalDate;

public class AchievementDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long communityId;
    private String communityName;
    private Long eventId;
    private String eventTitle;
    private String title;
    private String achievementType;
    private String description;
    private LocalDate achievementDate;

    public AchievementDTO() {}

    public AchievementDTO(Long id, Long studentId, String studentName, Long communityId, String communityName, Long eventId, String eventTitle, String title, String achievementType, String description, LocalDate achievementDate) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.communityId = communityId;
        this.communityName = communityName;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.title = title;
        this.achievementType = achievementType;
        this.description = description;
        this.achievementDate = achievementDate;
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
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAchievementType() { return achievementType; }
    public void setAchievementType(String achievementType) { this.achievementType = achievementType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getAchievementDate() { return achievementDate; }
    public void setAchievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; }

    public static AchievementDTOBuilder builder() { return new AchievementDTOBuilder(); }

    public static class AchievementDTOBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private Long communityId;
        private String communityName;
        private Long eventId;
        private String eventTitle;
        private String title;
        private String achievementType;
        private String description;
        private LocalDate achievementDate;

        public AchievementDTOBuilder id(Long id) { this.id = id; return this; }
        public AchievementDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public AchievementDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public AchievementDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public AchievementDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public AchievementDTOBuilder eventId(Long eventId) { this.eventId = eventId; return this; }
        public AchievementDTOBuilder eventTitle(String eventTitle) { this.eventTitle = eventTitle; return this; }
        public AchievementDTOBuilder title(String title) { this.title = title; return this; }
        public AchievementDTOBuilder achievementType(String achievementType) { this.achievementType = achievementType; return this; }
        public AchievementDTOBuilder description(String description) { this.description = description; return this; }
        public AchievementDTOBuilder achievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; return this; }

        public AchievementDTO build() {
            return new AchievementDTO(id, studentId, studentName, communityId, communityName, eventId, eventTitle, title, achievementType, description, achievementDate);
        }
    }
}
