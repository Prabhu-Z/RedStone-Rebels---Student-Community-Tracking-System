package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "student_id"})
})
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @Column(nullable = false)
    private String status;

    public EventRegistration() {}

    public EventRegistration(Long id, Event event, Student student, LocalDateTime registrationDate, String status) {
        this.id = id;
        this.event = event;
        this.student = student;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        if (this.registrationDate == null) {
            this.registrationDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "REGISTERED";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static EventRegistrationBuilder builder() { return new EventRegistrationBuilder(); }

    public static class EventRegistrationBuilder {
        private Long id;
        private Event event;
        private Student student;
        private LocalDateTime registrationDate;
        private String status;

        public EventRegistrationBuilder id(Long id) { this.id = id; return this; }
        public EventRegistrationBuilder event(Event event) { this.event = event; return this; }
        public EventRegistrationBuilder student(Student student) { this.student = student; return this; }
        public EventRegistrationBuilder registrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; return this; }
        public EventRegistrationBuilder status(String status) { this.status = status; return this; }

        public EventRegistration build() {
            return new EventRegistration(id, event, student, registrationDate, status);
        }
    }
}
