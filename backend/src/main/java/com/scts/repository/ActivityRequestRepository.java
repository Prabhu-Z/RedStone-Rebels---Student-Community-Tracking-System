package com.scts.repository;

import com.scts.entity.ActivityRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRequestRepository extends JpaRepository<ActivityRequest, Long> {
    List<ActivityRequest> findByStudentId(Long studentId);
    List<ActivityRequest> findByCommunityId(Long communityId);
    List<ActivityRequest> findByCommunityIdAndStatus(Long communityId, String status);
}
