package com.scts.controller;

import com.scts.dto.GroupedFacultyTaskDTO;
import com.scts.dto.TaskAssignmentDTO;
import com.scts.dto.TaskSubmissionDTO;
import com.scts.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskAssignmentDTO> createTaskAssignment(
            @RequestParam Long communityId,
            @RequestBody TaskAssignmentDTO dto) {
        return ResponseEntity.ok(taskService.createTaskAssignment(communityId, dto));
    }

    @PostMapping("/faculty/propose-all")
    public ResponseEntity<List<TaskAssignmentDTO>> proposeFacultyTaskToAllCommunities(
            @RequestBody TaskAssignmentDTO dto,
            @RequestParam(required = false) String facultyName) {
        return ResponseEntity.ok(taskService.proposeFacultyTaskToAllCommunities(dto, facultyName));
    }

    @GetMapping("/faculty/all")
    public ResponseEntity<List<TaskAssignmentDTO>> getAllFacultyTasks() {
        return ResponseEntity.ok(taskService.getAllFacultyTasks());
    }

    @GetMapping("/faculty/grouped")
    public ResponseEntity<List<GroupedFacultyTaskDTO>> getGroupedFacultyTasks() {
        return ResponseEntity.ok(taskService.getGroupedFacultyTasks());
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<TaskAssignmentDTO>> getCommunityTasks(@PathVariable Long communityId) {
        return ResponseEntity.ok(taskService.getCommunityTasks(communityId));
    }

    @GetMapping("/community/{communityId}/pending-faculty")
    public ResponseEntity<List<TaskAssignmentDTO>> getPendingFacultyTasksForCommunity(@PathVariable Long communityId) {
        return ResponseEntity.ok(taskService.getPendingFacultyTasksForCommunity(communityId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<TaskAssignmentDTO> acceptFacultyTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.acceptFacultyTask(id));
    }

    @PutMapping("/{id}/submit-to-admin")
    public ResponseEntity<TaskAssignmentDTO> submitTaskToAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.submitTaskToAdmin(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<TaskAssignmentDTO> rejectFacultyTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.rejectFacultyTask(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TaskSubmissionDTO>> getStudentTasks(@PathVariable Long studentId) {
        return ResponseEntity.ok(taskService.getStudentTasks(studentId));
    }

    @GetMapping("/{taskAssignmentId}/submissions")
    public ResponseEntity<List<TaskSubmissionDTO>> getTaskSubmissions(@PathVariable Long taskAssignmentId) {
        return ResponseEntity.ok(taskService.getTaskSubmissions(taskAssignmentId));
    }

    @PostMapping("/submissions/{submissionId}/submit")
    public ResponseEntity<TaskSubmissionDTO> submitTaskProof(
            @PathVariable Long submissionId,
            @RequestBody Map<String, String> payload) {
        String proofLink = payload.get("proofLink");
        String proofFileName = payload.get("proofFileName");
        String proofFileUrl = payload.get("proofFileUrl");

        return ResponseEntity.ok(taskService.submitTaskProof(submissionId, proofLink, proofFileName, proofFileUrl));
    }

    @PutMapping("/submissions/{submissionId}/verify")
    public ResponseEntity<TaskSubmissionDTO> verifySubmission(@PathVariable Long submissionId) {
        return ResponseEntity.ok(taskService.verifySubmission(submissionId));
    }

    @PutMapping("/submissions/{submissionId}/reject")
    public ResponseEntity<TaskSubmissionDTO> rejectSubmission(
            @PathVariable Long submissionId,
            @RequestBody(required = false) Map<String, String> payload) {
        String reason = payload != null ? payload.get("rejectionReason") : null;
        return ResponseEntity.ok(taskService.rejectSubmission(submissionId, reason));
    }
}
