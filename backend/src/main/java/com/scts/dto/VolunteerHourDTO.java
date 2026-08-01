package com.scts.dto;

import java.time.LocalDate;

public class VolunteerHourDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private Long communityId;
    private String communityName;
    private String activityName;
    private Double hours;
    private LocalDate activityDate;
    private String verificationStatus;

    public VolunteerHourDTO() {}

    public VolunteerHourDTO(Long id, Long studentId, String studentName, String studentCode, Long communityId, String communityName, String activityName, Double hours, LocalDate activityDate, String verificationStatus) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.communityId = communityId;
        this.communityName = communityName;
        this.activityName = activityName;
        this.hours = hours;
        this.activityDate = activityDate;
        this.verificationStatus = verificationStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }
    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }
    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }
    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }
    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }
    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public static VolunteerHourDTOBuilder builder() { return new VolunteerHourDTOBuilder(); }

    public static class VolunteerHourDTOBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private String studentCode;
        private Long communityId;
        private String communityName;
        private String activityName;
        private Double hours;
        private LocalDate activityDate;
        private String verificationStatus;

        public VolunteerHourDTOBuilder id(Long id) { this.id = id; return this; }
        public VolunteerHourDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public VolunteerHourDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public VolunteerHourDTOBuilder studentCode(String studentCode) { this.studentCode = studentCode; return this; }
        public VolunteerHourDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public VolunteerHourDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public VolunteerHourDTOBuilder activityName(String activityName) { this.activityName = activityName; return this; }
        public VolunteerHourDTOBuilder hours(Double hours) { this.hours = hours; return this; }
        public VolunteerHourDTOBuilder activityDate(LocalDate activityDate) { this.activityDate = activityDate; return this; }
        public VolunteerHourDTOBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }

        public VolunteerHourDTO build() {
            return new VolunteerHourDTO(id, studentId, studentName, studentCode, communityId, communityName, activityName, hours, activityDate, verificationStatus);
        }
    }
}
