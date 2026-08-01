package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "volunteer_hours")
public class VolunteerHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @Column(name = "activity_name", nullable = false)
    private String activityName;

    @Column(nullable = false)
    private Double hours;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "verification_status", nullable = false)
    private String verificationStatus;

    public VolunteerHour() {}

    public VolunteerHour(Long id, Student student, Community community, String activityName, Double hours, LocalDate activityDate, String verificationStatus) {
        this.id = id;
        this.student = student;
        this.community = community;
        this.activityName = activityName;
        this.hours = hours;
        this.activityDate = activityDate;
        this.verificationStatus = verificationStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Community getCommunity() { return community; }
    public void setCommunity(Community community) { this.community = community; }
    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }
    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }
    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public static VolunteerHourBuilder builder() { return new VolunteerHourBuilder(); }

    public static class VolunteerHourBuilder {
        private Long id;
        private Student student;
        private Community community;
        private String activityName;
        private Double hours;
        private LocalDate activityDate;
        private String verificationStatus;

        public VolunteerHourBuilder id(Long id) { this.id = id; return this; }
        public VolunteerHourBuilder student(Student student) { this.student = student; return this; }
        public VolunteerHourBuilder community(Community community) { this.community = community; return this; }
        public VolunteerHourBuilder activityName(String activityName) { this.activityName = activityName; return this; }
        public VolunteerHourBuilder hours(Double hours) { this.hours = hours; return this; }
        public VolunteerHourBuilder activityDate(LocalDate activityDate) { this.activityDate = activityDate; return this; }
        public VolunteerHourBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }

        public VolunteerHour build() {
            return new VolunteerHour(id, student, community, activityName, hours, activityDate, verificationStatus);
        }
    }
}
