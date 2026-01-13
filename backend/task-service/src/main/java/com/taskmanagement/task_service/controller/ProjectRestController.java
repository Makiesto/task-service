package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.dto.ProjectDetailsDTO;
import com.taskmanagement.task_service.security.RequireRole;
import com.taskmanagement.task_service.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectRestController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.findProjectById(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ProjectDetailsDTO> getProjectDetails(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectDetails(id));
    }

    @PostMapping
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        ProjectDTO created = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO));
    }

    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

}