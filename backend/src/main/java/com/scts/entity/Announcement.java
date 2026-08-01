package com.scts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "published_date", nullable = false)
    private LocalDateTime publishedDate;

    @Column(name = "created_by")
    private String createdBy;

    public Announcement() {}

    public Announcement(Long id, Community community, String title, String content, LocalDateTime publishedDate, String createdBy) {
        this.id = id;
        this.community = community;
        this.title = title;
        this.content = content;
        this.publishedDate = publishedDate;
        this.createdBy = createdBy;
    }

    @PrePersist
    protected void onCreate() {
        if (this.publishedDate == null) {
            this.publishedDate = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Community getCommunity() { return community; }
    public void setCommunity(Community community) { this.community = community; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public static AnnouncementBuilder builder() { return new AnnouncementBuilder(); }

    public static class AnnouncementBuilder {
        private Long id;
        private Community community;
        private String title;
        private String content;
        private LocalDateTime publishedDate;
        private String createdBy;

        public AnnouncementBuilder id(Long id) { this.id = id; return this; }
        public AnnouncementBuilder community(Community community) { this.community = community; return this; }
        public AnnouncementBuilder title(String title) { this.title = title; return this; }
        public AnnouncementBuilder content(String content) { this.content = content; return this; }
        public AnnouncementBuilder publishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; return this; }
        public AnnouncementBuilder createdBy(String createdBy) { this.createdBy = createdBy; return this; }

        public Announcement build() {
            return new Announcement(id, community, title, content, publishedDate, createdBy);
        }
    }
}
