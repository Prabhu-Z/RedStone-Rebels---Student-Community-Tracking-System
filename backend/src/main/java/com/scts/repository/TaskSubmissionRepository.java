package com.scts.repository;

import com.scts.entity.TaskSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {
    List<TaskSubmission> findByStudentId(Long studentId);
    List<TaskSubmission> findByTaskAssignmentId(Long taskAssignmentId);
}
