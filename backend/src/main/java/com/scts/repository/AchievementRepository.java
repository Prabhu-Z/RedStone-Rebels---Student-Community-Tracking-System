package com.scts.repository;

import com.scts.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByStudentId(Long studentId);
    List<Achievement> findByCommunityId(Long communityId);
    List<Achievement> findByEventId(Long eventId);
}
