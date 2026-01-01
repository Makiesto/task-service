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

    public Long userId;
    public String userEmail;
    public String userName;
    public String taskTitle;
    public LocalDateTime deadline;
    NotificationType notificationType;

}
