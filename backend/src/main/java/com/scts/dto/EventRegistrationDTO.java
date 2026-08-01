package com.scts.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventRegistrationDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentCode;
    private String department;
    private Long eventId;
    private String eventTitle;
    private String eventType;
    private String eventScope;
    private String communityName;
    private String venue;
    private LocalDate eventDate;
    private String time;
    private LocalDateTime registrationDate;
    private String status;

    public EventRegistrationDTO() {}

    public EventRegistrationDTO(Long id, Long studentId, String studentName, String studentCode, String department, LocalDateTime registrationDate, String status) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.department = department;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    public EventRegistrationDTO(Long id, Long studentId, String studentName, String studentCode, String department, Long eventId, String eventTitle, String eventType, String eventScope, String communityName, String venue, LocalDate eventDate, String time, LocalDateTime registrationDate, String status) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.department = department;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.eventType = eventType;
        this.eventScope = eventScope;
        this.communityName = communityName;
        this.venue = venue;
        this.eventDate = eventDate;
        this.time = time;
        this.registrationDate = registrationDate;
        this.status = status;
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

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getEventScope() { return eventScope; }
    public void setEventScope(String eventScope) { this.eventScope = eventScope; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
