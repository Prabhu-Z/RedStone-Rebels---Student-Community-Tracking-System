package com.scts.service;

import com.scts.dto.MembershipDTO;
import com.scts.entity.*;
import com.scts.exception.BadRequestException;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.CommunityRepository;
import com.scts.repository.MembershipRepository;
import com.scts.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final StudentRepository studentRepository;
    private final CommunityRepository communityRepository;
    private final NotificationService notificationService;

    @Autowired
    public MembershipService(MembershipRepository membershipRepository, StudentRepository studentRepository, CommunityRepository communityRepository, NotificationService notificationService) {
        this.membershipRepository = membershipRepository;
        this.studentRepository = studentRepository;
        this.communityRepository = communityRepository;
        this.notificationService = notificationService;
    }

    public List<MembershipDTO> getStudentMemberships(Long studentId) {
        return membershipRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MembershipDTO> getStudentMembershipsByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .map(s -> membershipRepository.findByStudentId(s.getId()).stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    public List<MembershipDTO> getCommunityMembers(Long communityId) {
        return membershipRepository.findByCommunityId(communityId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MembershipDTO> getPendingRequests() {
        return membershipRepository.findByStatus(MembershipStatus.PENDING).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MembershipDTO> getCommunityPendingRequests(Long communityId) {
        return membershipRepository.findByCommunityIdAndStatus(communityId, MembershipStatus.PENDING).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MembershipDTO requestMembership(Long studentId, Long communityId, CommunityRole role) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        if (student.getUser() != null && student.getUser().getRole() == Role.ROLE_COMMUNITY_COORDINATOR) {
            throw new BadRequestException("Community Coordinators are restricted to managing a single community and cannot join other communities.");
        }

        if (membershipRepository.findByStudentIdAndCommunityId(studentId, communityId).isPresent()) {
            throw new BadRequestException("Membership application already submitted.");
        }

        Membership membership = Membership.builder()
                .student(student)
                .community(community)
                .role(role != null ? role : CommunityRole.MEMBER)
                .status(MembershipStatus.PENDING)
                .build();

        Membership saved = membershipRepository.save(membership);
        return mapToDTO(saved);
    }

    @Transactional
    public MembershipDTO approveMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "id", id));

        membership.setStatus(MembershipStatus.APPROVED);
        Membership updated = membershipRepository.save(membership);

        notificationService.createNotification(
                membership.getStudent().getUser().getId(),
                "Membership Approved!",
                "Your application to join " + membership.getCommunity().getName() + " has been approved.",
                "MEMBERSHIP"
        );

        return mapToDTO(updated);
    }

    @Transactional
    public MembershipDTO rejectMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "id", id));

        membership.setStatus(MembershipStatus.REJECTED);
        Membership updated = membershipRepository.save(membership);

        notificationService.createNotification(
                membership.getStudent().getUser().getId(),
                "Membership Request Update",
                "Your application to join " + membership.getCommunity().getName() + " was not approved.",
                "MEMBERSHIP"
        );

        return mapToDTO(updated);
    }

    @Transactional
    public MembershipDTO assignStudentLeader(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "id", id));

        membership.setRole(CommunityRole.STUDENT_COORDINATOR);
        Membership updated = membershipRepository.save(membership);

        notificationService.createNotification(
                membership.getStudent().getUser().getId(),
                "Promoted to Student Leader!",
                "You have been assigned as a Student Leader for " + membership.getCommunity().getName() + ". You can now propose events to your coordinator!",
                "LEADERSHIP"
        );

        return mapToDTO(updated);
    }

    @Transactional
    public MembershipDTO dismissStudentLeader(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "id", id));

        membership.setRole(CommunityRole.MEMBER);
        Membership updated = membershipRepository.save(membership);

        notificationService.createNotification(
                membership.getStudent().getUser().getId(),
                "Leadership Role Update",
                "Your Student Leader role for " + membership.getCommunity().getName() + " has been reset to Member.",
                "LEADERSHIP"
        );

        return mapToDTO(updated);
    }

    @Transactional
    public void removeMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership", "id", id));
        membershipRepository.delete(membership);

        notificationService.createNotification(
                membership.getStudent().getUser().getId(),
                "Community Roster Update",
                "Your membership in " + membership.getCommunity().getName() + " has been removed by the coordinator.",
                "MEMBERSHIP"
        );
    }

    private MembershipDTO mapToDTO(Membership m) {
        return MembershipDTO.builder()
                .id(m.getId())
                .studentId(m.getStudent().getId())
                .studentName(m.getStudent().getName())
                .studentCode(m.getStudent().getStudentCode())
                .department(m.getStudent().getDepartment())
                .communityId(m.getCommunity().getId())
                .communityName(m.getCommunity().getName())
                .communityCategory(m.getCommunity().getCategory())
                .role(m.getRole())
                .status(m.getStatus())
                .joinedDate(m.getJoinedDate() != null ? m.getJoinedDate() : LocalDate.now())
                .build();
    }
}
