package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "achievements")
public class Achievement {

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

    @Column(nullable = false)
    private String title;

    @Column(name = "achievement_type", nullable = false)
    private String achievementType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "achievement_date", nullable = false)
    private LocalDate achievementDate;

    public Achievement() {}

    public Achievement(Long id, Student student, Community community, Event event, String title, String achievementType, String description, LocalDate achievementDate) {
        this.id = id;
        this.student = student;
        this.community = community;
        this.event = event;
        this.title = title;
        this.achievementType = achievementType;
        this.description = description;
        this.achievementDate = achievementDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Community getCommunity() { return community; }
    public void setCommunity(Community community) { this.community = community; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAchievementType() { return achievementType; }
    public void setAchievementType(String achievementType) { this.achievementType = achievementType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getAchievementDate() { return achievementDate; }
    public void setAchievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; }

    public static AchievementBuilder builder() { return new AchievementBuilder(); }

    public static class AchievementBuilder {
        private Long id;
        private Student student;
        private Community community;
        private Event event;
        private String title;
        private String achievementType;
        private String description;
        private LocalDate achievementDate;

        public AchievementBuilder id(Long id) { this.id = id; return this; }
        public AchievementBuilder student(Student student) { this.student = student; return this; }
        public AchievementBuilder community(Community community) { this.community = community; return this; }
        public AchievementBuilder event(Event event) { this.event = event; return this; }
        public AchievementBuilder title(String title) { this.title = title; return this; }
        public AchievementBuilder achievementType(String achievementType) { this.achievementType = achievementType; return this; }
        public AchievementBuilder description(String description) { this.description = description; return this; }
        public AchievementBuilder achievementDate(LocalDate achievementDate) { this.achievementDate = achievementDate; return this; }

        public Achievement build() {
            return new Achievement(id, student, community, event, title, achievementType, description, achievementDate);
        }
    }
}
