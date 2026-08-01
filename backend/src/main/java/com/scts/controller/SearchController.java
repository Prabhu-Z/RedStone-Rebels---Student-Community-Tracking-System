package com.scts.controller;

import com.scts.dto.CommunityDTO;
import com.scts.dto.EventDTO;
import com.scts.dto.StudentDTO;
import com.scts.entity.Community;
import com.scts.entity.Event;
import com.scts.entity.Student;
import com.scts.repository.CommunityRepository;
import com.scts.repository.EventRepository;
import com.scts.repository.StudentRepository;
import com.scts.service.CommunityService;
import com.scts.service.EventService;
import com.scts.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final StudentRepository studentRepository;
    private final CommunityRepository communityRepository;
    private final EventRepository eventRepository;
    private final StudentService studentService;
    private final CommunityService communityService;
    private final EventService eventService;

    @Autowired
    public SearchController(StudentRepository studentRepository, CommunityRepository communityRepository, EventRepository eventRepository, StudentService studentService, CommunityService communityService, EventService eventService) {
        this.studentRepository = studentRepository;
        this.communityRepository = communityRepository;
        this.eventRepository = eventRepository;
        this.studentService = studentService;
        this.communityService = communityService;
        this.eventService = eventService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentDTO>> searchStudents(@RequestParam String query) {
        List<Student> students = studentRepository.searchStudents(query);
        List<StudentDTO> dtos = students.stream()
                .map(s -> studentService.getStudentById(s.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/communities")
    public ResponseEntity<List<CommunityDTO>> searchCommunities(@RequestParam String query) {
        List<Community> communities = communityRepository.searchCommunities(query);
        List<CommunityDTO> dtos = communities.stream()
                .map(c -> communityService.getCommunityById(c.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventDTO>> searchEvents(@RequestParam String query) {
        List<Event> events = eventRepository.searchEvents(query);
        List<EventDTO> dtos = events.stream()
                .map(e -> eventService.getEventById(e.getId(), null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
