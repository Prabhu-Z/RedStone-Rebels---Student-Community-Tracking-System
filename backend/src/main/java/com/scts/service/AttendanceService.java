package com.scts.service;

import com.scts.dto.AttendanceDTO;
import com.scts.entity.Attendance;
import com.scts.entity.Event;
import com.scts.entity.Student;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.AttendanceRepository;
import com.scts.repository.EventRepository;
import com.scts.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, EventRepository eventRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.eventRepository = eventRepository;
        this.studentRepository = studentRepository;
    }

    public List<AttendanceDTO> getAttendanceByEvent(Long eventId) {
        return attendanceRepository.findByEventId(eventId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceDTO> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceDTO recordAttendance(Long eventId, Long studentId, String status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Attendance attendance = attendanceRepository.findByEventIdAndStudentId(eventId, studentId)
                .orElse(Attendance.builder()
                        .event(event)
                        .student(student)
                        .recordedTime(LocalDateTime.now())
                        .build());

        attendance.setStatus(status);
        attendance.setRecordedTime(LocalDateTime.now());

        Attendance saved = attendanceRepository.save(attendance);
        return mapToDTO(saved);
    }

    private AttendanceDTO mapToDTO(Attendance a) {
        return AttendanceDTO.builder()
                .id(a.getId())
                .eventId(a.getEvent().getId())
                .eventTitle(a.getEvent().getTitle())
                .communityName(a.getEvent().getCommunity().getName())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .studentCode(a.getStudent().getStudentCode())
                .status(a.getStatus())
                .recordedTime(a.getRecordedTime())
                .build();
    }
}
