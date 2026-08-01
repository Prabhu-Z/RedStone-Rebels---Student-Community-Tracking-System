package com.scts.repository;

import com.scts.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByStudentIdOrderByActivityDateDesc(Long studentId);
    List<Activity> findByCommunityIdOrderByActivityDateDesc(Long communityId);
    List<Activity> findByEventId(Long eventId);
    List<Activity> findAllByOrderByActivityDateDesc();
}
