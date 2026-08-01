package com.scts.repository;

import com.scts.entity.Membership;
import com.scts.entity.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByStudentId(Long studentId);
    List<Membership> findByCommunityId(Long communityId);
    List<Membership> findByStatus(MembershipStatus status);
    List<Membership> findByCommunityIdAndStatus(Long communityId, MembershipStatus status);
    List<Membership> findByStudentIdAndStatus(Long studentId, MembershipStatus status);
    Optional<Membership> findByStudentIdAndCommunityId(Long studentId, Long communityId);
    Boolean existsByStudentIdAndCommunityIdAndStatus(Long studentId, Long communityId, MembershipStatus status);

    @Query("SELECT COUNT(m) FROM Membership m WHERE m.community.id = :communityId AND (m.status = 'APPROVED' OR m.status = 'ACTIVE')")
    Long countActiveMembersByCommunityId(@Param("communityId") Long communityId);
}
