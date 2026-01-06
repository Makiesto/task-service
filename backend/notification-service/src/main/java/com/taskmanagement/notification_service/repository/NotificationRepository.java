package com.taskmanagement.notification_service.repository;

import com.taskmanagement.notification_service.entity.Notification;
import com.taskmanagement.notification_service.entity.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByStatusAndScheduledAtBefore(NotificationStatus notificationStatus, LocalDateTime now);
}
