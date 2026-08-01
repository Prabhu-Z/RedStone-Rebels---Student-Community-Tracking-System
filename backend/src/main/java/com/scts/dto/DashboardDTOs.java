package com.scts.dto;

import java.util.List;
import java.util.Map;

public class DashboardDTOs {

    public static class StudentDashboard {
        private StudentDTO student;
        private Long totalCommunities;
        private Long upcomingEventsCount;
        private Long registeredEventsCount;
        private Long eventsAttendedCount;
        private Double attendancePercentage;
        private Double totalVolunteerHours;
        private Integer achievementsCount;
        private Integer certificatesCount;
        private List<EventDTO> upcomingEvents;
        private List<ActivityDTO> recentActivities;
        private List<AnnouncementDTO> latestAnnouncements;
        private List<Map<String, Object>> attendanceChartData;
        private List<Map<String, Object>> communityCategoryData;

        public StudentDashboard() {}

        public StudentDashboard(StudentDTO student, Long totalCommunities, Long upcomingEventsCount, Long registeredEventsCount, Long eventsAttendedCount, Double attendancePercentage, Double totalVolunteerHours, Integer achievementsCount, Integer certificatesCount, List<EventDTO> upcomingEvents, List<ActivityDTO> recentActivities, List<AnnouncementDTO> latestAnnouncements, List<Map<String, Object>> attendanceChartData, List<Map<String, Object>> communityCategoryData) {
            this.student = student;
            this.totalCommunities = totalCommunities;
            this.upcomingEventsCount = upcomingEventsCount;
            this.registeredEventsCount = registeredEventsCount;
            this.eventsAttendedCount = eventsAttendedCount;
            this.attendancePercentage = attendancePercentage;
            this.totalVolunteerHours = totalVolunteerHours;
            this.achievementsCount = achievementsCount;
            this.certificatesCount = certificatesCount;
            this.upcomingEvents = upcomingEvents;
            this.recentActivities = recentActivities;
            this.latestAnnouncements = latestAnnouncements;
            this.attendanceChartData = attendanceChartData;
            this.communityCategoryData = communityCategoryData;
        }

        public StudentDTO getStudent() { return student; }
        public void setStudent(StudentDTO student) { this.student = student; }
        public Long getTotalCommunities() { return totalCommunities; }
        public void setTotalCommunities(Long totalCommunities) { this.totalCommunities = totalCommunities; }
        public Long getUpcomingEventsCount() { return upcomingEventsCount; }
        public void setUpcomingEventsCount(Long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; }
        public Long getRegisteredEventsCount() { return registeredEventsCount; }
        public void setRegisteredEventsCount(Long registeredEventsCount) { this.registeredEventsCount = registeredEventsCount; }
        public Long getEventsAttendedCount() { return eventsAttendedCount; }
        public void setEventsAttendedCount(Long eventsAttendedCount) { this.eventsAttendedCount = eventsAttendedCount; }
        public Double getAttendancePercentage() { return attendancePercentage; }
        public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
        public Double getTotalVolunteerHours() { return totalVolunteerHours; }
        public void setTotalVolunteerHours(Double totalVolunteerHours) { this.totalVolunteerHours = totalVolunteerHours; }
        public Integer getAchievementsCount() { return achievementsCount; }
        public void setAchievementsCount(Integer achievementsCount) { this.achievementsCount = achievementsCount; }
        public Integer getCertificatesCount() { return certificatesCount; }
        public void setCertificatesCount(Integer certificatesCount) { this.certificatesCount = certificatesCount; }
        public List<EventDTO> getUpcomingEvents() { return upcomingEvents; }
        public void setUpcomingEvents(List<EventDTO> upcomingEvents) { this.upcomingEvents = upcomingEvents; }
        public List<ActivityDTO> getRecentActivities() { return recentActivities; }
        public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }
        public List<AnnouncementDTO> getLatestAnnouncements() { return latestAnnouncements; }
        public void setLatestAnnouncements(List<AnnouncementDTO> latestAnnouncements) { this.latestAnnouncements = latestAnnouncements; }
        public List<Map<String, Object>> getAttendanceChartData() { return attendanceChartData; }
        public void setAttendanceChartData(List<Map<String, Object>> attendanceChartData) { this.attendanceChartData = attendanceChartData; }
        public List<Map<String, Object>> getCommunityCategoryData() { return communityCategoryData; }
        public void setCommunityCategoryData(List<Map<String, Object>> communityCategoryData) { this.communityCategoryData = communityCategoryData; }

        public static StudentDashboardBuilder builder() { return new StudentDashboardBuilder(); }

        public static class StudentDashboardBuilder {
            private StudentDTO student;
            private Long totalCommunities;
            private Long upcomingEventsCount;
            private Long registeredEventsCount;
            private Long eventsAttendedCount;
            private Double attendancePercentage;
            private Double totalVolunteerHours;
            private Integer achievementsCount;
            private Integer certificatesCount;
            private List<EventDTO> upcomingEvents;
            private List<ActivityDTO> recentActivities;
            private List<AnnouncementDTO> latestAnnouncements;
            private List<Map<String, Object>> attendanceChartData;
            private List<Map<String, Object>> communityCategoryData;

            public StudentDashboardBuilder student(StudentDTO student) { this.student = student; return this; }
            public StudentDashboardBuilder totalCommunities(Long totalCommunities) { this.totalCommunities = totalCommunities; return this; }
            public StudentDashboardBuilder upcomingEventsCount(Long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; return this; }
            public StudentDashboardBuilder registeredEventsCount(Long registeredEventsCount) { this.registeredEventsCount = registeredEventsCount; return this; }
            public StudentDashboardBuilder eventsAttendedCount(Long eventsAttendedCount) { this.eventsAttendedCount = eventsAttendedCount; return this; }
            public StudentDashboardBuilder attendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; return this; }
            public StudentDashboardBuilder totalVolunteerHours(Double totalVolunteerHours) { this.totalVolunteerHours = totalVolunteerHours; return this; }
            public StudentDashboardBuilder achievementsCount(Integer achievementsCount) { this.achievementsCount = achievementsCount; return this; }
            public StudentDashboardBuilder certificatesCount(Integer certificatesCount) { this.certificatesCount = certificatesCount; return this; }
            public StudentDashboardBuilder upcomingEvents(List<EventDTO> upcomingEvents) { this.upcomingEvents = upcomingEvents; return this; }
            public StudentDashboardBuilder recentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; return this; }
            public StudentDashboardBuilder latestAnnouncements(List<AnnouncementDTO> latestAnnouncements) { this.latestAnnouncements = latestAnnouncements; return this; }
            public StudentDashboardBuilder attendanceChartData(List<Map<String, Object>> attendanceChartData) { this.attendanceChartData = attendanceChartData; return this; }
            public StudentDashboardBuilder communityCategoryData(List<Map<String, Object>> communityCategoryData) { this.communityCategoryData = communityCategoryData; return this; }

            public StudentDashboard build() {
                return new StudentDashboard(student, totalCommunities, upcomingEventsCount, registeredEventsCount, eventsAttendedCount, attendancePercentage, totalVolunteerHours, achievementsCount, certificatesCount, upcomingEvents, recentActivities, latestAnnouncements, attendanceChartData, communityCategoryData);
            }
        }
    }

    public static class CoordinatorDashboard {
        private CommunityDTO community;
        private Long totalMembers;
        private Long pendingRequestsCount;
        private Long upcomingEventsCount;
        private Long completedEventsCount;
        private Double averageAttendancePercentage;
        private Double totalVolunteerHours;
        private Integer totalAchievements;
        private List<MembershipDTO> pendingRequests;
        private List<EventDTO> upcomingEvents;
        private List<ActivityDTO> recentActivities;
        private List<Map<String, Object>> memberGrowthData;
        private List<Map<String, Object>> eventParticipationData;

        public CoordinatorDashboard() {}

        public CoordinatorDashboard(CommunityDTO community, Long totalMembers, Long pendingRequestsCount, Long upcomingEventsCount, Long completedEventsCount, Double averageAttendancePercentage, Double totalVolunteerHours, Integer totalAchievements, List<MembershipDTO> pendingRequests, List<EventDTO> upcomingEvents, List<ActivityDTO> recentActivities, List<Map<String, Object>> memberGrowthData, List<Map<String, Object>> eventParticipationData) {
            this.community = community;
            this.totalMembers = totalMembers;
            this.pendingRequestsCount = pendingRequestsCount;
            this.upcomingEventsCount = upcomingEventsCount;
            this.completedEventsCount = completedEventsCount;
            this.averageAttendancePercentage = averageAttendancePercentage;
            this.totalVolunteerHours = totalVolunteerHours;
            this.totalAchievements = totalAchievements;
            this.pendingRequests = pendingRequests;
            this.upcomingEvents = upcomingEvents;
            this.recentActivities = recentActivities;
            this.memberGrowthData = memberGrowthData;
            this.eventParticipationData = eventParticipationData;
        }

        public CommunityDTO getCommunity() { return community; }
        public void setCommunity(CommunityDTO community) { this.community = community; }
        public Long getTotalMembers() { return totalMembers; }
        public void setTotalMembers(Long totalMembers) { this.totalMembers = totalMembers; }
        public Long getPendingRequestsCount() { return pendingRequestsCount; }
        public void setPendingRequestsCount(Long pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; }
        public Long getUpcomingEventsCount() { return upcomingEventsCount; }
        public void setUpcomingEventsCount(Long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; }
        public Long getCompletedEventsCount() { return completedEventsCount; }
        public void setCompletedEventsCount(Long completedEventsCount) { this.completedEventsCount = completedEventsCount; }
        public Double getAverageAttendancePercentage() { return averageAttendancePercentage; }
        public void setAverageAttendancePercentage(Double averageAttendancePercentage) { this.averageAttendancePercentage = averageAttendancePercentage; }
        public Double getTotalVolunteerHours() { return totalVolunteerHours; }
        public void setTotalVolunteerHours(Double totalVolunteerHours) { this.totalVolunteerHours = totalVolunteerHours; }
        public Integer getTotalAchievements() { return totalAchievements; }
        public void setTotalAchievements(Integer totalAchievements) { this.totalAchievements = totalAchievements; }
        public List<MembershipDTO> getPendingRequests() { return pendingRequests; }
        public void setPendingRequests(List<MembershipDTO> pendingRequests) { this.pendingRequests = pendingRequests; }
        public List<EventDTO> getUpcomingEvents() { return upcomingEvents; }
        public void setUpcomingEvents(List<EventDTO> upcomingEvents) { this.upcomingEvents = upcomingEvents; }
        public List<ActivityDTO> getRecentActivities() { return recentActivities; }
        public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }
        public List<Map<String, Object>> getMemberGrowthData() { return memberGrowthData; }
        public void setMemberGrowthData(List<Map<String, Object>> memberGrowthData) { this.memberGrowthData = memberGrowthData; }
        public List<Map<String, Object>> getEventParticipationData() { return eventParticipationData; }
        public void setEventParticipationData(List<Map<String, Object>> eventParticipationData) { this.eventParticipationData = eventParticipationData; }

        public static CoordinatorDashboardBuilder builder() { return new CoordinatorDashboardBuilder(); }

        public static class CoordinatorDashboardBuilder {
            private CommunityDTO community;
            private Long totalMembers;
            private Long pendingRequestsCount;
            private Long upcomingEventsCount;
            private Long completedEventsCount;
            private Double averageAttendancePercentage;
            private Double totalVolunteerHours;
            private Integer totalAchievements;
            private List<MembershipDTO> pendingRequests;
            private List<EventDTO> upcomingEvents;
            private List<ActivityDTO> recentActivities;
            private List<Map<String, Object>> memberGrowthData;
            private List<Map<String, Object>> eventParticipationData;

            public CoordinatorDashboardBuilder community(CommunityDTO community) { this.community = community; return this; }
            public CoordinatorDashboardBuilder totalMembers(Long totalMembers) { this.totalMembers = totalMembers; return this; }
            public CoordinatorDashboardBuilder pendingRequestsCount(Long pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; return this; }
            public CoordinatorDashboardBuilder upcomingEventsCount(Long upcomingEventsCount) { this.upcomingEventsCount = upcomingEventsCount; return this; }
            public CoordinatorDashboardBuilder completedEventsCount(Long completedEventsCount) { this.completedEventsCount = completedEventsCount; return this; }
            public CoordinatorDashboardBuilder averageAttendancePercentage(Double averageAttendancePercentage) { this.averageAttendancePercentage = averageAttendancePercentage; return this; }
            public CoordinatorDashboardBuilder totalVolunteerHours(Double totalVolunteerHours) { this.totalVolunteerHours = totalVolunteerHours; return this; }
            public CoordinatorDashboardBuilder totalAchievements(Integer totalAchievements) { this.totalAchievements = totalAchievements; return this; }
            public CoordinatorDashboardBuilder pendingRequests(List<MembershipDTO> pendingRequests) { this.pendingRequests = pendingRequests; return this; }
            public CoordinatorDashboardBuilder upcomingEvents(List<EventDTO> upcomingEvents) { this.upcomingEvents = upcomingEvents; return this; }
            public CoordinatorDashboardBuilder recentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; return this; }
            public CoordinatorDashboardBuilder memberGrowthData(List<Map<String, Object>> memberGrowthData) { this.memberGrowthData = memberGrowthData; return this; }
            public CoordinatorDashboardBuilder eventParticipationData(List<Map<String, Object>> eventParticipationData) { this.eventParticipationData = eventParticipationData; return this; }

            public CoordinatorDashboard build() {
                return new CoordinatorDashboard(community, totalMembers, pendingRequestsCount, upcomingEventsCount, completedEventsCount, averageAttendancePercentage, totalVolunteerHours, totalAchievements, pendingRequests, upcomingEvents, recentActivities, memberGrowthData, eventParticipationData);
            }
        }
    }

    public static class FacultyDashboard {
        private Long totalCommunities;
        private Long totalStudents;
        private Long activeCommunities;
        private Long totalEvents;
        private Long totalRegistrations;
        private Double overallAttendancePercentage;
        private Double totalVolunteerHours;
        private Integer totalAchievements;
        private List<CommunityDTO> topCommunities;
        private List<EventDTO> recentEvents;
        private List<Map<String, Object>> communityDistribution;
        private List<Map<String, Object>> monthlyParticipationTrend;
        private List<Map<String, Object>> departmentWiseInvolvement;

        public FacultyDashboard() {}

        public FacultyDashboard(Long totalCommunities, Long totalStudents, Long activeCommunities, Long totalEvents, Long totalRegistrations, Double overallAttendancePercentage, Double totalVolunteerHours, Integer totalAchievements, List<CommunityDTO> topCommunities, List<EventDTO> recentEvents, List<Map<String, Object>> communityDistribution, List<Map<String, Object>> monthlyParticipationTrend, List<Map<String, Object>> departmentWiseInvolvement) {
            this.totalCommunities = totalCommunities;
            this.totalStudents = totalStudents;
            this.activeCommunities = activeCommunities;
            this.totalEvents = totalEvents;
            this.totalRegistrations = totalRegistrations;
            this.overallAttendancePercentage = overallAttendancePercentage;
            this.totalVolunteerHours = totalVolunteerHours;
            this.totalAchievements = totalAchievements;
            this.topCommunities = topCommunities;
            this.recentEvents = recentEvents;
            this.communityDistribution = communityDistribution;
            this.monthlyParticipationTrend = monthlyParticipationTrend;
            this.departmentWiseInvolvement = departmentWiseInvolvement;
        }

        public Long getTotalCommunities() { return totalCommunities; }
        public void setTotalCommunities(Long totalCommunities) { this.totalCommunities = totalCommunities; }
        public Long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }
        public Long getActiveCommunities() { return activeCommunities; }
        public void setActiveCommunities(Long activeCommunities) { this.activeCommunities = activeCommunities; }
        public Long getTotalEvents() { return totalEvents; }
        public void setTotalEvents(Long totalEvents) { this.totalEvents = totalEvents; }
        public Long getTotalRegistrations() { return totalRegistrations; }
        public void setTotalRegistrations(Long totalRegistrations) { this.totalRegistrations = totalRegistrations; }
        public Double getOverallAttendancePercentage() { return overallAttendancePercentage; }
        public void setOverallAttendancePercentage(Double overallAttendancePercentage) { this.overallAttendancePercentage = overallAttendancePercentage; }
        public Double getTotalVolunteerHours() { return totalVolunteerHours; }
        public void setTotalVolunteerHours(Double totalVolunteerHours) { this.totalVolunteerHours = totalVolunteerHours; }
        public Integer getTotalAchievements() { return totalAchievements; }
        public void setTotalAchievements(Integer totalAchievements) { this.totalAchievements = totalAchievements; }
        public List<CommunityDTO> getTopCommunities() { return topCommunities; }
        public void setTopCommunities(List<CommunityDTO> topCommunities) { this.topCommunities = topCommunities; }
        public List<EventDTO> getRecentEvents() { return recentEvents; }
        public void setRecentEvents(List<EventDTO> recentEvents) { this.recentEvents = recentEvents; }
        public List<Map<String, Object>> getCommunityDistribution() { return communityDistribution; }
        public void setCommunityDistribution(List<Map<String, Object>> communityDistribution) { this.communityDistribution = communityDistribution; }
        public List<Map<String, Object>> getMonthlyParticipationTrend() { return monthlyParticipationTrend; }
        public void setMonthlyParticipationTrend(List<Map<String, Object>> monthlyParticipationTrend) { this.monthlyParticipationTrend = monthlyParticipationTrend; }
        public List<Map<String, Object>> getDepartmentWiseInvolvement() { return departmentWiseInvolvement; }
        public void setDepartmentWiseInvolvement(List<Map<String, Object>> departmentWiseInvolvement) { this.departmentWiseInvolvement = departmentWiseInvolvement; }

        public static FacultyDashboardBuilder builder() { return new FacultyDashboardBuilder(); }

        public static class FacultyDashboardBuilder {
            private Long totalCommunities;
            private Long totalStudents;
            private Long activeCommunities;
            private Long totalEvents;
            private Long totalRegistrations;
            private Double overallAttendancePercentage;
            private Double totalVolunteerHours;
            private Integer totalAchievements;
            private List<CommunityDTO> topCommunities;
            private List<EventDTO> recentEvents;
            private List<Map<String, Object>> communityDistribution;
            private List<Map<String, Object>> monthlyParticipationTrend;
            private List<Map<String, Object>> departmentWiseInvolvement;

            public FacultyDashboardBuilder totalCommunities(Long totalCommunities) { this.totalCommunities = totalCommunities; return this; }
            public FacultyDashboardBuilder totalStudents(Long totalStudents) { this.totalStudents = totalStudents; return this; }
            public FacultyDashboardBuilder activeCommunities(Long activeCommunities) { this.activeCommunities = activeCommunities; return this; }
            public FacultyDashboardBuilder totalEvents(Long totalEvents) { this.totalEvents = totalEvents; return this; }
            public FacultyDashboardBuilder totalRegistrations(Long totalRegistrations) { this.totalRegistrations = totalRegistrations; return this; }
            public FacultyDashboardBuilder overallAttendancePercentage(Double overallAttendancePercentage) { this.overallAttendancePercentage = overallAttendancePercentage; return this; }
            public FacultyDashboardBuilder totalVolunteerHours(Double totalVolunteerHours) { this.totalVolunteerHours = totalVolunteerHours; return this; }
            public FacultyDashboardBuilder totalAchievements(Integer totalAchievements) { this.totalAchievements = totalAchievements; return this; }
            public FacultyDashboardBuilder topCommunities(List<CommunityDTO> topCommunities) { this.topCommunities = topCommunities; return this; }
            public FacultyDashboardBuilder recentEvents(List<EventDTO> recentEvents) { this.recentEvents = recentEvents; return this; }
            public FacultyDashboardBuilder communityDistribution(List<Map<String, Object>> communityDistribution) { this.communityDistribution = communityDistribution; return this; }
            public FacultyDashboardBuilder monthlyParticipationTrend(List<Map<String, Object>> monthlyParticipationTrend) { this.monthlyParticipationTrend = monthlyParticipationTrend; return this; }
            public FacultyDashboardBuilder departmentWiseInvolvement(List<Map<String, Object>> departmentWiseInvolvement) { this.departmentWiseInvolvement = departmentWiseInvolvement; return this; }

            public FacultyDashboard build() {
                return new FacultyDashboard(totalCommunities, totalStudents, activeCommunities, totalEvents, totalRegistrations, overallAttendancePercentage, totalVolunteerHours, totalAchievements, topCommunities, recentEvents, communityDistribution, monthlyParticipationTrend, departmentWiseInvolvement);
            }
        }
    }
}
