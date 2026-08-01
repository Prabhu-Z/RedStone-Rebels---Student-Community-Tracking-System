package com.scts.service;

import com.scts.dto.VolunteerHourDTO;
import com.scts.entity.Community;
import com.scts.entity.Student;
import com.scts.entity.VolunteerHour;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.CommunityRepository;
import com.scts.repository.StudentRepository;
import com.scts.repository.VolunteerHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VolunteerHourService {

    private final VolunteerHourRepository volunteerHourRepository;
    private final StudentRepository studentRepository;
    private final CommunityRepository communityRepository;
    private final NotificationService notificationService;

    @Autowired
    public VolunteerHourService(VolunteerHourRepository volunteerHourRepository, StudentRepository studentRepository, CommunityRepository communityRepository, NotificationService notificationService) {
        this.volunteerHourRepository = volunteerHourRepository;
        this.studentRepository = studentRepository;
        this.communityRepository = communityRepository;
        this.notificationService = notificationService;
    }

    public List<VolunteerHourDTO> getStudentVolunteerHours(Long studentId) {
        return volunteerHourRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<VolunteerHourDTO> getPendingHours() {
        return volunteerHourRepository.findByVerificationStatus("PENDING").stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VolunteerHourDTO logVolunteerHours(VolunteerHourDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId()));
        Community community = communityRepository.findById(dto.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", dto.getCommunityId()));

        VolunteerHour hour = VolunteerHour.builder()
                .student(student)
                .community(community)
                .activityName(dto.getActivityName())
                .hours(dto.getHours())
                .activityDate(dto.getActivityDate())
                .verificationStatus("PENDING")
                .build();

        VolunteerHour saved = volunteerHourRepository.save(hour);
        return mapToDTO(saved);
    }

    @Transactional
    public VolunteerHourDTO verifyVolunteerHours(Long id, String status) {
        VolunteerHour hour = volunteerHourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerHour", "id", id));

        hour.setVerificationStatus(status);
        VolunteerHour updated = volunteerHourRepository.save(hour);

        notificationService.createNotification(
                hour.getStudent().getUser().getId(),
                "Volunteer Hours " + status,
                "Your " + hour.getHours() + " hours logged for " + hour.getActivityName() + " have been " + status.toLowerCase() + ".",
                "VOLUNTEER"
        );

        return mapToDTO(updated);
    }

    private VolunteerHourDTO mapToDTO(VolunteerHour h) {
        return VolunteerHourDTO.builder()
                .id(h.getId())
                .studentId(h.getStudent().getId())
                .studentName(h.getStudent().getName())
                .studentCode(h.getStudent().getStudentCode())
                .communityId(h.getCommunity().getId())
                .communityName(h.getCommunity().getName())
                .activityName(h.getActivityName())
                .hours(h.getHours())
                .activityDate(h.getActivityDate())
                .verificationStatus(h.getVerificationStatus())
                .build();
    }
}
