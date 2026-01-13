package com.taskmanagement.task_service.dto;

import com.taskmanagement.task_service.entity.Priority;
import com.taskmanagement.task_service.entity.TaskStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private Long id;
    @NotBlank(message = "Title is required")

    private String title;
    private Long projectId;
    private String description;

    private String assignedToEmail;

    @NotNull
    @Future(message = "Deadline must be in future")
    private LocalDateTime deadline;

    private TaskStatus status;
    private Priority priority;

    private List<TaskAssignmentDTO> assignment;
}
