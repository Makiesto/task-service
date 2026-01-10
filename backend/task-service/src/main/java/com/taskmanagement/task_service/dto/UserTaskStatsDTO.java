package com.taskmanagement.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserTaskStatsDTO {
    private String userEmail;
    private Long totalTasks;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long todoTasks;
    private Long highPriorityTasks;
    private Long criticalPriorityTasks;
}