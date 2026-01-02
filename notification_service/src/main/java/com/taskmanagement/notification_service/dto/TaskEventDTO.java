package com.taskmanagement.notification_service.dto;

import com.taskmanagement.notification_service.entity.NotificationType;
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
