package com.scts.dto;

import java.util.List;

public class GroupedFacultyTaskDTO {
    private String title;
    private String description;
    private String targetYear;
    private String deadline;
    private String assignedByFacultyName;
    private int totalCommunitiesTargeted;
    private int acceptedCommunitiesCount;
    private List<TaskAssignmentDTO> communityAssignments;

    public GroupedFacultyTaskDTO() {}

    public GroupedFacultyTaskDTO(String title, String description, String targetYear, String deadline, String assignedByFacultyName, int totalCommunitiesTargeted, int acceptedCommunitiesCount, List<TaskAssignmentDTO> communityAssignments) {
        this.title = title;
        this.description = description;
        this.targetYear = targetYear;
        this.deadline = deadline;
        this.assignedByFacultyName = assignedByFacultyName;
        this.totalCommunitiesTargeted = totalCommunitiesTargeted;
        this.acceptedCommunitiesCount = acceptedCommunitiesCount;
        this.communityAssignments = communityAssignments;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetYear() { return targetYear; }
    public void setTargetYear(String targetYear) { this.targetYear = targetYear; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getAssignedByFacultyName() { return assignedByFacultyName; }
    public void setAssignedByFacultyName(String assignedByFacultyName) { this.assignedByFacultyName = assignedByFacultyName; }

    public int getTotalCommunitiesTargeted() { return totalCommunitiesTargeted; }
    public void setTotalCommunitiesTargeted(int totalCommunitiesTargeted) { this.totalCommunitiesTargeted = totalCommunitiesTargeted; }

    public int getAcceptedCommunitiesCount() { return acceptedCommunitiesCount; }
    public void setAcceptedCommunitiesCount(int acceptedCommunitiesCount) { this.acceptedCommunitiesCount = acceptedCommunitiesCount; }

    public List<TaskAssignmentDTO> getCommunityAssignments() { return communityAssignments; }
    public void setCommunityAssignments(List<TaskAssignmentDTO> communityAssignments) { this.communityAssignments = communityAssignments; }

    public static GroupedFacultyTaskDTOBuilder builder() { return new GroupedFacultyTaskDTOBuilder(); }

    public static class GroupedFacultyTaskDTOBuilder {
        private String title;
        private String description;
        private String targetYear;
        private String deadline;
        private String assignedByFacultyName;
        private int totalCommunitiesTargeted;
        private int acceptedCommunitiesCount;
        private List<TaskAssignmentDTO> communityAssignments;

        public GroupedFacultyTaskDTOBuilder title(String title) { this.title = title; return this; }
        public GroupedFacultyTaskDTOBuilder description(String description) { this.description = description; return this; }
        public GroupedFacultyTaskDTOBuilder targetYear(String targetYear) { this.targetYear = targetYear; return this; }
        public GroupedFacultyTaskDTOBuilder deadline(String deadline) { this.deadline = deadline; return this; }
        public GroupedFacultyTaskDTOBuilder assignedByFacultyName(String assignedByFacultyName) { this.assignedByFacultyName = assignedByFacultyName; return this; }
        public GroupedFacultyTaskDTOBuilder totalCommunitiesTargeted(int totalCommunitiesTargeted) { this.totalCommunitiesTargeted = totalCommunitiesTargeted; return this; }
        public GroupedFacultyTaskDTOBuilder acceptedCommunitiesCount(int acceptedCommunitiesCount) { this.acceptedCommunitiesCount = acceptedCommunitiesCount; return this; }
        public GroupedFacultyTaskDTOBuilder communityAssignments(List<TaskAssignmentDTO> communityAssignments) { this.communityAssignments = communityAssignments; return this; }

        public GroupedFacultyTaskDTO build() {
            return new GroupedFacultyTaskDTO(title, description, targetYear, deadline, assignedByFacultyName, totalCommunitiesTargeted, acceptedCommunitiesCount, communityAssignments);
        }
    }
}
