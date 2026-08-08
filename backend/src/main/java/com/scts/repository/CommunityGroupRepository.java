package com.scts.repository;

import com.scts.entity.CommunityGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityGroupRepository extends JpaRepository<CommunityGroup, Long> {
    List<CommunityGroup> findByCommunityId(Long communityId);
    List<CommunityGroup> findByCommunityIdAndApprovalStatus(Long communityId, String approvalStatus);
    List<CommunityGroup> findByLeaderStudentId(Long leaderStudentId);
}
