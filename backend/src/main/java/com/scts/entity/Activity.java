package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(nullable = false)
    private String role;

    private String contribution;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Activity() {}

    public Activity(Long id, Student student, Community community, Event event, String activityType, String role, String contribution, LocalDate activityDate, String description) {
        this.id = id;
        this.student = student;
        this.community = community;
        this.event = event;
        this.activityType = activityType;
        this.role = role;
        this.contribution = contribution;
        this.activityDate = activityDate;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Community getCommunity() { return community; }
    public void setCommunity(Community community) { this.community = community; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
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

    public static ActivityBuilder builder() { return new ActivityBuilder(); }

    public static class ActivityBuilder {
        private Long id;
        private Student student;
        private Community community;
        private Event event;
        private String activityType;
        private String role;
        private String contribution;
        private LocalDate activityDate;
        private String description;

        public ActivityBuilder id(Long id) { this.id = id; return this; }
        public ActivityBuilder student(Student student) { this.student = student; return this; }
        public ActivityBuilder community(Community community) { this.community = community; return this; }
        public ActivityBuilder event(Event event) { this.event = event; return this; }
        public ActivityBuilder activityType(String activityType) { this.activityType = activityType; return this; }
        public ActivityBuilder role(String role) { this.role = role; return this; }
        public ActivityBuilder contribution(String contribution) { this.contribution = contribution; return this; }
        public ActivityBuilder activityDate(LocalDate activityDate) { this.activityDate = activityDate; return this; }
        public ActivityBuilder description(String description) { this.description = description; return this; }

        public Activity build() {
            return new Activity(id, student, community, event, activityType, role, contribution, activityDate, description);
        }
    }
}
