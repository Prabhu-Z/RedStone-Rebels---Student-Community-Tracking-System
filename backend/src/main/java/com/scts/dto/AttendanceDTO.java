package com.scts.dto;

import java.time.LocalDateTime;

public class AttendanceDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String communityName;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private String status;
    private LocalDateTime recordedTime;

    public AttendanceDTO() {}

    public AttendanceDTO(Long id, Long eventId, String eventTitle, String communityName, Long studentId, String studentName, String studentCode, String status, LocalDateTime recordedTime) {
        this.id = id;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.communityName = communityName;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.status = status;
        this.recordedTime = recordedTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getRecordedTime() { return recordedTime; }
    public void setRecordedTime(LocalDateTime recordedTime) { this.recordedTime = recordedTime; }

    public static AttendanceDTOBuilder builder() { return new AttendanceDTOBuilder(); }

    public static class AttendanceDTOBuilder {
        private Long id;
        private Long eventId;
        private String eventTitle;
        private String communityName;
        private Long studentId;
        private String studentName;
        private String studentCode;
        private String status;
        private LocalDateTime recordedTime;

        public AttendanceDTOBuilder id(Long id) { this.id = id; return this; }
        public AttendanceDTOBuilder eventId(Long eventId) { this.eventId = eventId; return this; }
        public AttendanceDTOBuilder eventTitle(String eventTitle) { this.eventTitle = eventTitle; return this; }
        public AttendanceDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public AttendanceDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public AttendanceDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public AttendanceDTOBuilder studentCode(String studentCode) { this.studentCode = studentCode; return this; }
        public AttendanceDTOBuilder status(String status) { this.status = status; return this; }
        public AttendanceDTOBuilder recordedTime(LocalDateTime recordedTime) { this.recordedTime = recordedTime; return this; }

        public AttendanceDTO build() {
            return new AttendanceDTO(id, eventId, eventTitle, communityName, studentId, studentName, studentCode, status, recordedTime);
        }
    }
}
