package com.scts.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CommunityGroupDTO {

    private Long id;
    private String groupName;
    private String description;
    private Integer maxTeamSize;
    private Long currentMemberCount;
    private Long communityId;
    private String communityName;
    private Long leaderStudentId;
    private String leaderStudentName;
    private String leaderStudentCode;
    private String leaderDepartment;
    private String status;
    private String approvalStatus;
    private LocalDateTime createdAt;
    private List<GroupMemberDTO> members;

    public CommunityGroupDTO() {}

    public static class GroupMemberDTO {
        private Long id;
        private Long studentId;
        private String studentName;
        private String studentCode;
        private String department;
        private String role;
        private LocalDateTime joinedAt;

        public GroupMemberDTO() {}

        public GroupMemberDTO(Long id, Long studentId, String studentName, String studentCode, String department, String role, LocalDateTime joinedAt) {
            this.id = id;
            this.studentId = studentId;
            this.studentName = studentName;
            this.studentCode = studentCode;
            this.department = department;
            this.role = role;
            this.joinedAt = joinedAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public String getStudentCode() { return studentCode; }
        public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getMaxTeamSize() { return maxTeamSize; }
    public void setMaxTeamSize(Integer maxTeamSize) { this.maxTeamSize = maxTeamSize; }

    public Long getCurrentMemberCount() { return currentMemberCount; }
    public void setCurrentMemberCount(Long currentMemberCount) { this.currentMemberCount = currentMemberCount; }

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

    public Long getLeaderStudentId() { return leaderStudentId; }
    public void setLeaderStudentId(Long leaderStudentId) { this.leaderStudentId = leaderStudentId; }

    public String getLeaderStudentName() { return leaderStudentName; }
    public void setLeaderStudentName(String leaderStudentName) { this.leaderStudentName = leaderStudentName; }

    public String getLeaderStudentCode() { return leaderStudentCode; }
    public void setLeaderStudentCode(String leaderStudentCode) { this.leaderStudentCode = leaderStudentCode; }

    public String getLeaderDepartment() { return leaderDepartment; }
    public void setLeaderDepartment(String leaderDepartment) { this.leaderDepartment = leaderDepartment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<GroupMemberDTO> getMembers() { return members; }
    public void setMembers(List<GroupMemberDTO> members) { this.members = members; }
}
