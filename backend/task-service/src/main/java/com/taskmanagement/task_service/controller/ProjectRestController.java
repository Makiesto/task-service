package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.AssignUsersRequestDTO;
import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.dto.ProjectDetailsDTO;
import com.taskmanagement.task_service.dto.TaskAssignmentDTO;
import com.taskmanagement.task_service.security.RequireRole;
import com.taskmanagement.task_service.service.ProjectService;
import com.taskmanagement.task_service.service.TaskAssignmentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProjectRestController {

    private final ProjectService projectService;
    private final TaskAssignmentService taskAssignmentService;

    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects(HttpServletRequest request) {
        String userRole = request.getHeader("X-User-Role");
        String userEmail = request.getHeader("X-User-Email");

        return ResponseEntity.ok(projectService.findAllProjects(userRole, userEmail));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findProjectById(id));
    }

    @GetMapping("/projects/{id}/details")
    public ResponseEntity<ProjectDetailsDTO> getProjectDetails(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectDetails(id));
    }

    @PostMapping("/projects")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        ProjectDTO created = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/projects/{id}")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO));
    }

    @DeleteMapping("/projects/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/tasks/{taskId}/assign-users")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<List<TaskAssignmentDTO>> assignUsersToTask(
            @PathVariable Long taskId,
            @RequestBody AssignUsersRequestDTO request) {
        List<TaskAssignmentDTO> assignments = taskAssignmentService.assignUsersToTask(taskId, request.getUserEmails());
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/tasks/{taskId}/assignments")
    public ResponseEntity<List<TaskAssignmentDTO>> getTaskAssignments(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskAssignmentService.getTaskAssignments(taskId));
    }

    @DeleteMapping("/tasks/{taskId}/assignments/{userEmail}")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<Void> removeUserFromTask(
            @PathVariable Long taskId,
            @PathVariable String userEmail) {
        taskAssignmentService.removeUserFromTask(taskId, userEmail);
        return ResponseEntity.noContent().build();
    }
}