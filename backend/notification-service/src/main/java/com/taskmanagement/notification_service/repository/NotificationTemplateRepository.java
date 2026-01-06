package com.taskmanagement.notification_service.repository;

import com.taskmanagement.notification_service.entity.NotificationTemplate;
import com.taskmanagement.notification_service.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {
    Optional<NotificationTemplate> findByType(NotificationType type);
}
