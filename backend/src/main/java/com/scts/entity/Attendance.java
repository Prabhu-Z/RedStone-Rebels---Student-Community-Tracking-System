package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "student_id"})
})
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String status;

    @Column(name = "recorded_time", nullable = false)
    private LocalDateTime recordedTime;

    public Attendance() {}

    public Attendance(Long id, Event event, Student student, String status, LocalDateTime recordedTime) {
        this.id = id;
        this.event = event;
        this.student = student;
        this.status = status;
        this.recordedTime = recordedTime;
    }

    @PrePersist
    protected void onCreate() {
        if (this.recordedTime == null) {
            this.recordedTime = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getRecordedTime() { return recordedTime; }
    public void setRecordedTime(LocalDateTime recordedTime) { this.recordedTime = recordedTime; }

    public static AttendanceBuilder builder() { return new AttendanceBuilder(); }

    public static class AttendanceBuilder {
        private Long id;
        private Event event;
        private Student student;
        private String status;
        private LocalDateTime recordedTime;

        public AttendanceBuilder id(Long id) { this.id = id; return this; }
        public AttendanceBuilder event(Event event) { this.event = event; return this; }
        public AttendanceBuilder student(Student student) { this.student = student; return this; }
        public AttendanceBuilder status(String status) { this.status = status; return this; }
        public AttendanceBuilder recordedTime(LocalDateTime recordedTime) { this.recordedTime = recordedTime; return this; }

        public Attendance build() {
            return new Attendance(id, event, student, status, recordedTime);
        }
    }
}
