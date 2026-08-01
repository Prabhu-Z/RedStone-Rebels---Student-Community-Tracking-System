package com.scts.service;

import com.scts.dto.ActivityDTO;
import com.scts.entity.Activity;
import com.scts.entity.Community;
import com.scts.entity.Event;
import com.scts.entity.Student;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.ActivityRepository;
import com.scts.repository.CommunityRepository;
import com.scts.repository.EventRepository;
import com.scts.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final StudentRepository studentRepository;
    private final CommunityRepository communityRepository;
    private final EventRepository eventRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository, StudentRepository studentRepository, CommunityRepository communityRepository, EventRepository eventRepository) {
        this.activityRepository = activityRepository;
        this.studentRepository = studentRepository;
        this.communityRepository = communityRepository;
        this.eventRepository = eventRepository;
    }

    public List<ActivityDTO> getStudentActivities(Long studentId) {
        return activityRepository.findByStudentIdOrderByActivityDateDesc(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ActivityDTO createActivity(ActivityDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", dto.getStudentId()));
        Community community = communityRepository.findById(dto.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", dto.getCommunityId()));

        Event event = null;
        if (dto.getEventId() != null) {
            event = eventRepository.findById(dto.getEventId()).orElse(null);
        }

        Activity activity = Activity.builder()
                .student(student)
                .community(community)
                .event(event)
                .activityType(dto.getActivityType())
                .role(dto.getRole())
                .contribution(dto.getContribution())
                .activityDate(dto.getActivityDate())
                .description(dto.getDescription())
                .build();

        Activity saved = activityRepository.save(activity);
        return mapToDTO(saved);
    }

    private ActivityDTO mapToDTO(Activity a) {
        return ActivityDTO.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .communityId(a.getCommunity().getId())
                .communityName(a.getCommunity().getName())
                .eventId(a.getEvent() != null ? a.getEvent().getId() : null)
                .eventTitle(a.getEvent() != null ? a.getEvent().getTitle() : null)
                .activityType(a.getActivityType())
                .role(a.getRole())
                .contribution(a.getContribution())
                .activityDate(a.getActivityDate())
                .description(a.getDescription())
                .build();
    }
}
