package com.taskmanagement.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailsDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private List<TaskDTO> tasks;
    private ProjectStatsDTO stats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectStatsDTO {
        private int totalTasks;
        private int todoTasks;
        private int inProgressTasks;
        private int doneTasks;
        private int highPriorityTasks;
        private int criticalPriorityTasks;
        private double completionRate;
    }
}