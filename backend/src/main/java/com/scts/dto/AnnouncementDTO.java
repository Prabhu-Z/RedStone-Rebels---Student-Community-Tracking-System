package com.scts.dto;

import java.time.LocalDateTime;

public class AnnouncementDTO {
    private Long id;
    private Long communityId;
    private String communityName;
    private String title;
    private String content;
    private LocalDateTime publishedDate;
    private String createdBy;

    public AnnouncementDTO() {}

    public AnnouncementDTO(Long id, Long communityId, String communityName, String title, String content, LocalDateTime publishedDate, String createdBy) {
        this.id = id;
        this.communityId = communityId;
        this.communityName = communityName;
        this.title = title;
        this.content = content;
        this.publishedDate = publishedDate;
        this.createdBy = createdBy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }
    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public static AnnouncementDTOBuilder builder() { return new AnnouncementDTOBuilder(); }

    public static class AnnouncementDTOBuilder {
        private Long id;
        private Long communityId;
        private String communityName;
        private String title;
        private String content;
        private LocalDateTime publishedDate;
        private String createdBy;

        public AnnouncementDTOBuilder id(Long id) { this.id = id; return this; }
        public AnnouncementDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public AnnouncementDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }
        public AnnouncementDTOBuilder title(String title) { this.title = title; return this; }
        public AnnouncementDTOBuilder content(String content) { this.content = content; return this; }
        public AnnouncementDTOBuilder publishedDate(LocalDateTime publishedDate) { this.publishedDate = publishedDate; return this; }
        public AnnouncementDTOBuilder createdBy(String createdBy) { this.createdBy = createdBy; return this; }

        public AnnouncementDTO build() {
            return new AnnouncementDTO(id, communityId, communityName, title, content, publishedDate, createdBy);
        }
    }
}
