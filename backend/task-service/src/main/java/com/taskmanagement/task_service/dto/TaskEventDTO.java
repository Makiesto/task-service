package com.taskmanagement.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TaskEventDTO {
    private Long userId;
    private String userEmail;
    private String userName;
    private String taskTitle;
    private LocalDateTime deadline;
    private String eventType;
}
