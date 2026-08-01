package com.scts.dto;

public class LeaderboardEntryDTO {
    private int rank;
    private Long studentId;
    private String studentCode;
    private String studentName;
    private String department;
    private int points; // 1 point per verified task submission
    private Long communityId;
    private String communityName;

    public LeaderboardEntryDTO() {}

    public LeaderboardEntryDTO(int rank, Long studentId, String studentCode, String studentName, String department, int points, Long communityId, String communityName) {
        this.rank = rank;
        this.studentId = studentId;
        this.studentCode = studentCode;
        this.studentName = studentName;
        this.department = department;
        this.points = points;
        this.communityId = communityId;
        this.communityName = communityName;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

    public static LeaderboardEntryDTOBuilder builder() { return new LeaderboardEntryDTOBuilder(); }

    public static class LeaderboardEntryDTOBuilder {
        private int rank;
        private Long studentId;
        private String studentCode;
        private String studentName;
        private String department;
        private int points;
        private Long communityId;
        private String communityName;

        public LeaderboardEntryDTOBuilder rank(int rank) { this.rank = rank; return this; }
        public LeaderboardEntryDTOBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public LeaderboardEntryDTOBuilder studentCode(String studentCode) { this.studentCode = studentCode; return this; }
        public LeaderboardEntryDTOBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public LeaderboardEntryDTOBuilder department(String department) { this.department = department; return this; }
        public LeaderboardEntryDTOBuilder points(int points) { this.points = points; return this; }
        public LeaderboardEntryDTOBuilder communityId(Long communityId) { this.communityId = communityId; return this; }
        public LeaderboardEntryDTOBuilder communityName(String communityName) { this.communityName = communityName; return this; }

        public LeaderboardEntryDTO build() {
            return new LeaderboardEntryDTO(rank, studentId, studentCode, studentName, department, points, communityId, communityName);
        }
    }
}
