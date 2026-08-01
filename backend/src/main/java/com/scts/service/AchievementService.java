package com.scts.service;

import com.scts.dto.AchievementDTO;
import com.scts.entity.Achievement;
import com.scts.entity.Community;
import com.scts.entity.Event;
import com.scts.entity.Student;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.AchievementRepository;
import com.scts.repository.CommunityRepository;
import com.scts.repository.EventRepository;
import com.scts.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final StudentRepository studentRepository;
    private final CommunityRepository communityRepository;
    private final EventRepository eventRepository;

    @Autowired
    public AchievementService(AchievementRepository achievementRepository, StudentRepository studentRepository, CommunityRepository communityRepository, EventRepository eventRepository) {
        this.achievementRepository = achievementRepository;
        this.studentRepository = studentRepository;
        this.communityRepository = communityRepository;
        this.eventRepository = eventRepository;
    }

    public List<AchievementDTO> getStudentAchievements(Long studentId) {
        return achievementRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AchievementDTO createAchievement(AchievementDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId()));
        Community community = communityRepository.findById(dto.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", dto.getCommunityId()));

        Event event = null;
        if (dto.getEventId() != null) {
            event = eventRepository.findById(dto.getEventId()).orElse(null);
        }

        Achievement achievement = Achievement.builder()
                .student(student)
                .community(community)
                .event(event)
                .title(dto.getTitle())
                .achievementType(dto.getAchievementType())
                .description(dto.getDescription())
                .achievementDate(dto.getAchievementDate())
                .build();

        Achievement saved = achievementRepository.save(achievement);
        return mapToDTO(saved);
    }

    private AchievementDTO mapToDTO(Achievement a) {
        return AchievementDTO.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .communityId(a.getCommunity().getId())
                .communityName(a.getCommunity().getName())
                .eventId(a.getEvent() != null ? a.getEvent().getId() : null)
                .eventTitle(a.getEvent() != null ? a.getEvent().getTitle() : null)
                .title(a.getTitle())
                .achievementType(a.getAchievementType())
                .description(a.getDescription())
                .achievementDate(a.getAchievementDate())
                .build();
    }
}
