package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.dto.UserTaskStatsDTO;
import com.taskmanagement.task_service.security.RequireRole;
import com.taskmanagement.task_service.service.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskRestController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(HttpServletRequest request) {
        String userRole = request.getHeader("X-User-Role");
        String userEmail = request.getHeader("X-User-Email");

        List<TaskDTO> tasks = taskService.findAllTasks();

        if ("DEVELOPER".equals(userRole)) {
            tasks = tasks.stream()
                    .filter(task -> userEmail.equals(task.getAssignedToEmail()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(
            @PathVariable Long id,
            HttpServletRequest request) {

        String userRole = request.getHeader("X-User-Role");
        String userEmail = request.getHeader("X-User-Email");

        TaskDTO task = taskService.findTaskById(id);

        if ("DEVELOPER".equals(userRole) && !userEmail.equals(task.getAssignedToEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(task);
    }

    @PostMapping
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO) {
        TaskDTO created = taskService.createTask(taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @Valid @RequestBody TaskDTO taskDTO,
            @PathVariable Long id,
            HttpServletRequest request) {

        String userRole = request.getHeader("X-User-Role");
        String userEmail = request.getHeader("X-User-Email");

        // DEVELOPER can only update their own tasks
        if ("DEVELOPER".equals(userRole)) {
            TaskDTO existingTask = taskService.findTaskById(id);
            if (!userEmail.equals(existingTask.getAssignedToEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(taskService.updateTask(id, taskDTO));
    }

    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<Void> deleteTaskById(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign")
    @RequireRole({"ADMIN", "MANAGER"})
    public ResponseEntity<TaskDTO> assignTaskToUser(
            @PathVariable Long id,
            @RequestBody AssignRequest request) {
        TaskDTO taskUpdated = taskService.assignTaskToUser(id, request.assignedToEmail());
        return ResponseEntity.ok(taskUpdated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            HttpServletRequest httpRequest) {

        String userRole = httpRequest.getHeader("X-User-Role");
        String userEmail = httpRequest.getHeader("X-User-Email");

        if ("DEVELOPER".equals(userRole)) {
            TaskDTO existingTask = taskService.findTaskById(id);
            if (!userEmail.equals(existingTask.getAssignedToEmail())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        TaskDTO taskUpdated = taskService.updateTaskStatus(id, request.status());
        return ResponseEntity.ok(taskUpdated);
    }

    @GetMapping("/stats/user/{email}")
    public ResponseEntity<UserTaskStatsDTO> getUserStats(@PathVariable String email) {
        UserTaskStatsDTO stats = taskService.getUserTaskStats(email);
        return ResponseEntity.ok(stats);
    }

    record StatusUpdateRequest(String status) {}
    record AssignRequest(String assignedToEmail) {}
}