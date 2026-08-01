package com.scts.service;

import com.scts.dto.AnnouncementDTO;
import com.scts.entity.Announcement;
import com.scts.entity.Community;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.AnnouncementRepository;
import com.scts.repository.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final CommunityRepository communityRepository;

    @Autowired
    public AnnouncementService(AnnouncementRepository announcementRepository, CommunityRepository communityRepository) {
        this.announcementRepository = announcementRepository;
        this.communityRepository = communityRepository;
    }

    public List<AnnouncementDTO> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByPublishedDateDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AnnouncementDTO> getCommunityAnnouncements(Long communityId) {
        return announcementRepository.findByCommunityIdOrderByPublishedDateDesc(communityId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AnnouncementDTO createAnnouncement(AnnouncementDTO dto) {
        Community community = communityRepository.findById(dto.getCommunityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", dto.getCommunityId()));

        Announcement announcement = Announcement.builder()
                .community(community)
                .title(dto.getTitle())
                .content(dto.getContent())
                .publishedDate(LocalDateTime.now())
                .createdBy(dto.getCreatedBy() != null ? dto.getCreatedBy() : "Coordinator")
                .build();

        Announcement saved = announcementRepository.save(announcement);
        return mapToDTO(saved);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new ResourceNotFoundException("Announcement", "id", id);
        }
        announcementRepository.deleteById(id);
    }

    private AnnouncementDTO mapToDTO(Announcement a) {
        return AnnouncementDTO.builder()
                .id(a.getId())
                .communityId(a.getCommunity().getId())
                .communityName(a.getCommunity().getName())
                .title(a.getTitle())
                .content(a.getContent())
                .publishedDate(a.getPublishedDate())
                .createdBy(a.getCreatedBy())
                .build();
    }
}
