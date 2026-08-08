package com.scts.dto;

public class CommunityDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String facultyCoordinator;
    private String studentCoordinator;
    private Long coordinatorUserId;
    private Integer maxSize = 100;
    private String status;
    private Long memberCount;
    private Integer upcomingEventCount;

    public CommunityDTO() {}

    public CommunityDTO(Long id, String name, String description, String category, String facultyCoordinator, String studentCoordinator, Long coordinatorUserId, Integer maxSize, String status, Long memberCount, Integer upcomingEventCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.facultyCoordinator = facultyCoordinator;
        this.studentCoordinator = studentCoordinator;
        this.coordinatorUserId = coordinatorUserId;
        this.maxSize = maxSize != null ? maxSize : 100;
        this.status = status;
        this.memberCount = memberCount;
        this.upcomingEventCount = upcomingEventCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFacultyCoordinator() { return facultyCoordinator; }
    public void setFacultyCoordinator(String facultyCoordinator) { this.facultyCoordinator = facultyCoordinator; }
    public String getStudentCoordinator() { return studentCoordinator; }
    public void setStudentCoordinator(String studentCoordinator) { this.studentCoordinator = studentCoordinator; }
    public Long getCoordinatorUserId() { return coordinatorUserId; }
    public void setCoordinatorUserId(Long coordinatorUserId) { this.coordinatorUserId = coordinatorUserId; }
    public Integer getMaxSize() { return maxSize; }
    public void setMaxSize(Integer maxSize) { this.maxSize = maxSize != null ? maxSize : 100; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getMemberCount() { return memberCount; }
    public void setMemberCount(Long memberCount) { this.memberCount = memberCount; }
    public Integer getUpcomingEventCount() { return upcomingEventCount; }
    public void setUpcomingEventCount(Integer upcomingEventCount) { this.upcomingEventCount = upcomingEventCount; }

    public static CommunityDTOBuilder builder() { return new CommunityDTOBuilder(); }

    public static class CommunityDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private String category;
        private String facultyCoordinator;
        private String studentCoordinator;
        private Long coordinatorUserId;
        private Integer maxSize = 100;
        private String status;
        private Long memberCount;
        private Integer upcomingEventCount;

        public CommunityDTOBuilder id(Long id) { this.id = id; return this; }
        public CommunityDTOBuilder name(String name) { this.name = name; return this; }
        public CommunityDTOBuilder description(String description) { this.description = description; return this; }
        public CommunityDTOBuilder category(String category) { this.category = category; return this; }
        public CommunityDTOBuilder facultyCoordinator(String facultyCoordinator) { this.facultyCoordinator = facultyCoordinator; return this; }
        public CommunityDTOBuilder studentCoordinator(String studentCoordinator) { this.studentCoordinator = studentCoordinator; return this; }
        public CommunityDTOBuilder coordinatorUserId(Long coordinatorUserId) { this.coordinatorUserId = coordinatorUserId; return this; }
        public CommunityDTOBuilder maxSize(Integer maxSize) { this.maxSize = maxSize; return this; }
        public CommunityDTOBuilder status(String status) { this.status = status; return this; }
        public CommunityDTOBuilder memberCount(Long memberCount) { this.memberCount = memberCount; return this; }
        public CommunityDTOBuilder upcomingEventCount(Integer upcomingEventCount) { this.upcomingEventCount = upcomingEventCount; return this; }

        public CommunityDTO build() {
            return new CommunityDTO(id, name, description, category, facultyCoordinator, studentCoordinator, coordinatorUserId, maxSize, status, memberCount, upcomingEventCount);
        }
    }
}
