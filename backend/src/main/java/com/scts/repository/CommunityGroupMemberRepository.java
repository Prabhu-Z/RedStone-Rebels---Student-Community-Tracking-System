package com.scts.repository;

import com.scts.entity.CommunityGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityGroupMemberRepository extends JpaRepository<CommunityGroupMember, Long> {
    List<CommunityGroupMember> findByGroupId(Long groupId);
    List<CommunityGroupMember> findByStudentId(Long studentId);
    Optional<CommunityGroupMember> findByGroupIdAndStudentId(Long groupId, Long studentId);
    long countByGroupId(Long groupId);
    void deleteByGroupIdAndStudentId(Long groupId, Long studentId);
}
