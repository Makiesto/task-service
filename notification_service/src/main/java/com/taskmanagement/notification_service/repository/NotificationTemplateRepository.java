package com.taskmanagement.notification_service.repository;

import com.taskmanagement.notification_service.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Integer> {
}
