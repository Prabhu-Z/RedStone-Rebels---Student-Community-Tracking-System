package com.scts.service;

import com.scts.dto.CommunityGroupDTO;
import com.scts.dto.CommunityGroupDTO.GroupMemberDTO;
import com.scts.entity.*;
import com.scts.exception.ResourceNotFoundException;
import com.scts.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommunityGroupService {

    private final CommunityGroupRepository groupRepository;
    private final CommunityGroupMemberRepository groupMemberRepository;
    private final CommunityRepository communityRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public CommunityGroupService(CommunityGroupRepository groupRepository, CommunityGroupMemberRepository groupMemberRepository, CommunityRepository communityRepository, StudentRepository studentRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.communityRepository = communityRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional
    public CommunityGroupDTO createGroup(Long communityId, Long leaderStudentId, String groupName, String description, Integer maxTeamSize) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));

        Student leader = studentRepository.findById(leaderStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", leaderStudentId));

        int capacity = (maxTeamSize != null && maxTeamSize > 0) ? maxTeamSize : 5;

        CommunityGroup group = new CommunityGroup();
        group.setGroupName(groupName);
        group.setDescription(description);
        group.setMaxTeamSize(capacity);
        group.setCommunity(community);
        group.setLeaderStudent(leader);
        group.setStatus("PENDING");
        group.setApprovalStatus("PENDING");
        group.setCreatedAt(LocalDateTime.now());

        CommunityGroup savedGroup = groupRepository.save(group);

        // Auto-add leader as LEADER member of the group
        CommunityGroupMember leaderMember = new CommunityGroupMember();
        leaderMember.setGroup(savedGroup);
        leaderMember.setStudent(leader);
        leaderMember.setRole("LEADER");
        leaderMember.setJoinedAt(LocalDateTime.now());
        groupMemberRepository.save(leaderMember);

        return mapToDTO(savedGroup);
    }

    public List<CommunityGroupDTO> getGroupsByCommunity(Long communityId) {
        List<CommunityGroup> groups = groupRepository.findByCommunityId(communityId);
        return groups.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<CommunityGroupDTO> getApprovedGroupsByCommunity(Long communityId) {
        List<CommunityGroup> groups = groupRepository.findByCommunityIdAndApprovalStatus(communityId, "APPROVED");
        return groups.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<CommunityGroupDTO> getPendingGroupsByCommunity(Long communityId) {
        List<CommunityGroup> groups = groupRepository.findByCommunityIdAndApprovalStatus(communityId, "PENDING");
        return groups.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public CommunityGroupDTO approveGroup(Long groupId) {
        CommunityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("CommunityGroup", "id", groupId));
        group.setApprovalStatus("APPROVED");
        group.setStatus("OPEN");
        CommunityGroup saved = groupRepository.save(group);
        return mapToDTO(saved);
    }

    @Transactional
    public CommunityGroupDTO declineGroup(Long groupId) {
        CommunityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("CommunityGroup", "id", groupId));
        group.setApprovalStatus("DECLINED");
        group.setStatus("DECLINED");
        CommunityGroup saved = groupRepository.save(group);
        return mapToDTO(saved);
    }

    public List<CommunityGroupDTO> getGroupsForStudent(Long studentId) {
        List<CommunityGroupMember> memberships = groupMemberRepository.findByStudentId(studentId);
        return memberships.stream()
                .map(m -> mapToDTO(m.getGroup()))
                .collect(Collectors.toList());
    }

    public CommunityGroupDTO getGroupById(Long groupId) {
        CommunityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("CommunityGroup", "id", groupId));
        return mapToDTO(group);
    }

    @Transactional
    public CommunityGroupDTO updateMaxTeamSize(Long groupId, Integer newMaxTeamSize) {
        CommunityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("CommunityGroup", "id", groupId));

        if (newMaxTeamSize != null && newMaxTeamSize > 0) {
            group.setMaxTeamSize(newMaxTeamSize);
            long memberCount = groupMemberRepository.countByGroupId(groupId);
            if (memberCount >= newMaxTeamSize) {
                group.setStatus("FULL");
            } else {
                group.setStatus("OPEN");
            }
            groupRepository.save(group);
        }

        return mapToDTO(group);
    }

    @Transactional
    public CommunityGroupDTO joinGroup(Long groupId, Long studentId) {
        CommunityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("CommunityGroup", "id", groupId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Optional<CommunityGroupMember> existing = groupMemberRepository.findByGroupIdAndStudentId(groupId, studentId);
        if (existing.isPresent()) {
            return mapToDTO(group); // Already joined
        }

        long count = groupMemberRepository.countByGroupId(groupId);
        if (count >= group.getMaxTeamSize()) {
            throw new IllegalArgumentException("Cannot join. Team has reached its maximum size of " + group.getMaxTeamSize() + " members.");
        }

        CommunityGroupMember member = new CommunityGroupMember();
        member.setGroup(group);
        member.setStudent(student);
        member.setRole("MEMBER");
        member.setJoinedAt(LocalDateTime.now());
        groupMemberRepository.save(member);

        long updatedCount = count + 1;
        if (updatedCount >= group.getMaxTeamSize()) {
            group.setStatus("FULL");
            groupRepository.save(group);
        }

        return mapToDTO(group);
    }

    @Transactional
    public CommunityGroupDTO leaveGroup(Long groupId, Long studentId) {
        CommunityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("CommunityGroup", "id", groupId));

        groupMemberRepository.deleteByGroupIdAndStudentId(groupId, studentId);

        long count = groupMemberRepository.countByGroupId(groupId);
        if (count < group.getMaxTeamSize()) {
            group.setStatus("OPEN");
            groupRepository.save(group);
        }

        return mapToDTO(group);
    }

    @Transactional
    public void deleteGroup(Long groupId) {
        List<CommunityGroupMember> members = groupMemberRepository.findByGroupId(groupId);
        groupMemberRepository.deleteAll(members);
        groupRepository.deleteById(groupId);
    }

    private CommunityGroupDTO mapToDTO(CommunityGroup group) {
        List<CommunityGroupMember> members = groupMemberRepository.findByGroupId(group.getId());
        long count = members.size();

        List<GroupMemberDTO> memberDTOs = members.stream()
                .map(m -> new GroupMemberDTO(
                        m.getId(),
                        m.getStudent().getId(),
                        m.getStudent().getName(),
                        m.getStudent().getStudentCode(),
                        m.getStudent().getDepartment(),
                        m.getRole(),
                        m.getJoinedAt()
                ))
                .collect(Collectors.toList());

        CommunityGroupDTO dto = new CommunityGroupDTO();
        dto.setId(group.getId());
        dto.setGroupName(group.getGroupName());
        dto.setDescription(group.getDescription());
        dto.setMaxTeamSize(group.getMaxTeamSize());
        dto.setCurrentMemberCount(count);
        dto.setCommunityId(group.getCommunity() != null ? group.getCommunity().getId() : null);
        dto.setCommunityName(group.getCommunity() != null ? group.getCommunity().getName() : null);

        if (group.getLeaderStudent() != null) {
            dto.setLeaderStudentId(group.getLeaderStudent().getId());
            dto.setLeaderStudentName(group.getLeaderStudent().getName());
            dto.setLeaderStudentCode(group.getLeaderStudent().getStudentCode());
            dto.setLeaderDepartment(group.getLeaderStudent().getDepartment());
        }

        dto.setStatus(group.getStatus());
        dto.setApprovalStatus(group.getApprovalStatus());
        dto.setCreatedAt(group.getCreatedAt());
        dto.setMembers(memberDTOs);

        return dto;
    }
}
