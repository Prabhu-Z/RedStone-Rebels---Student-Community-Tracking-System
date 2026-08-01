package com.scts.repository;

import com.scts.entity.VolunteerHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerHourRepository extends JpaRepository<VolunteerHour, Long> {
    List<VolunteerHour> findByStudentId(Long studentId);
    List<VolunteerHour> findByCommunityId(Long communityId);
    List<VolunteerHour> findByVerificationStatus(String status);
    List<VolunteerHour> findByStudentIdAndVerificationStatus(Long studentId, String status);

    @Query("SELECT COALESCE(SUM(v.hours), 0.0) FROM VolunteerHour v WHERE v.student.id = :studentId AND v.verificationStatus = 'VERIFIED'")
    Double sumVerifiedHoursByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COALESCE(SUM(v.hours), 0.0) FROM VolunteerHour v WHERE v.community.id = :communityId AND v.verificationStatus = 'VERIFIED'")
    Double sumVerifiedHoursByCommunityId(@Param("communityId") Long communityId);
}
