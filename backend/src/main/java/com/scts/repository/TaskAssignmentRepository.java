package com.scts.repository;

import com.scts.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByCommunityId(Long communityId);
    List<TaskAssignment> findByCommunityIdAndStatus(Long communityId, String status);
    List<TaskAssignment> findByStatus(String status);
}
