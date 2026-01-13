package com.taskmanagement.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskAssignmentDTO {
    private Long id;
    private Long taskId;
    private String userEmail;
    private String userName;
    private LocalDateTime assignedAt;
}