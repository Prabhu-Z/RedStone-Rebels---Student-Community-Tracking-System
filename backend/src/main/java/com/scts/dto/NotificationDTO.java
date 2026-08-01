package com.scts.dto;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Long id, Long userId, String title, String message, String type, Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static NotificationDTOBuilder builder() { return new NotificationDTOBuilder(); }

    public static class NotificationDTOBuilder {
        private Long id;
        private Long userId;
        private String title;
        private String message;
        private String type;
        private Boolean isRead;
        private LocalDateTime createdAt;

        public NotificationDTOBuilder id(Long id) { this.id = id; return this; }
        public NotificationDTOBuilder userId(Long userId) { this.userId = userId; return this; }
        public NotificationDTOBuilder title(String title) { this.title = title; return this; }
        public NotificationDTOBuilder message(String message) { this.message = message; return this; }
        public NotificationDTOBuilder type(String type) { this.type = type; return this; }
        public NotificationDTOBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public NotificationDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationDTO build() {
            return new NotificationDTO(id, userId, title, message, type, isRead, createdAt);
        }
    }
}
