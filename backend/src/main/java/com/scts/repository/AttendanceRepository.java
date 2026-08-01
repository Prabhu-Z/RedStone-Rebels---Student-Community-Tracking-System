package com.scts.repository;

import com.scts.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByStudentId(Long studentId);
    Optional<Attendance> findByEventIdAndStudentId(Long eventId, Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentEventsByStudentId(@Param("studentId") Long studentId);
}
