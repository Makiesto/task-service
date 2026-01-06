package com.taskmanagement.notification_service.service;

import com.taskmanagement.notification_service.dto.TaskEventDTO;

public interface NotificationService {
    void createNotification(TaskEventDTO taskEventDTO);
    void sendNotification();
}
