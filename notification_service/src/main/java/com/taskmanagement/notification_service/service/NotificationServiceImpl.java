package com.taskmanagement.notification_service.service;

import com.taskmanagement.notification_service.dto.TaskEventDTO;
import com.taskmanagement.notification_service.entity.Notification;
import com.taskmanagement.notification_service.entity.NotificationStatus;
import com.taskmanagement.notification_service.entity.NotificationTemplate;
import com.taskmanagement.notification_service.entity.NotificationType;
import com.taskmanagement.notification_service.repository.NotificationRepository;
import com.taskmanagement.notification_service.repository.NotificationTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationTemplateRepository templateRepository;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public void createNotification(TaskEventDTO event) {
        saveSingleNotification(event, NotificationType.valueOf(event.getEventType()));

        if (isCreationEvent(event.getEventType()) && event.getDeadline() != null) {

            if (event.getDeadline().isAfter(LocalDateTime.now().plusDays(3))) {
                saveSingleNotification(event, NotificationType.TASK_REMINDER_3D);
            }

            if (event.getDeadline().isAfter(LocalDateTime.now().plusHours(24))) {
                saveSingleNotification(event, NotificationType.TASK_REMINDER_24H);
            }
        }
    }

    private void saveSingleNotification(TaskEventDTO event, NotificationType type) {
        NotificationTemplate template = templateRepository.findByType(type)
                .orElseThrow(() -> new RuntimeException("Template not found for: " + type));

        String message = template.getBody()
                .replace("{userName}", event.getUserName())
                .replace("{taskTitle}", event.getTaskTitle())
                .replace("{deadline}", event.getDeadline().toString());

        LocalDateTime scheduleTime = calculateScheduleTime(type, event.getDeadline());

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .recipientEmail(event.getUserEmail())
                .notificationType(type)
                .message(message)
                .scheduledAt(scheduleTime)
                .status(NotificationStatus.PENDING)
                .build();

        notificationRepository.save(notification);
    }

    private boolean isCreationEvent(String type) {
        return "TASK_CREATED".equals(type) || "TASK_ASSIGNED".equals(type);
    }

    private LocalDateTime calculateScheduleTime(NotificationType type, LocalDateTime deadline) {
    return switch (type) {
        case TASK_CREATED, TASK_ASSIGNED, TASK_COMPLETED, TASK_EMAIL_CHANGED ->
            LocalDateTime.now();

        case TASK_REMINDER_3D ->
            deadline.minusDays(3);

        case TASK_REMINDER_24H ->
            deadline.minusHours(24);

        default -> LocalDateTime.now();
    };
}

    @Override
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void sendNotification() {

        List<Notification> pending = notificationRepository
                .findAllByStatusAndScheduledAtBefore(NotificationStatus.PENDING, LocalDateTime.now());

        for (Notification notification : pending) {
            try {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(notification.getRecipientEmail());
                mailMessage.setSubject("Notification has been sent");
                mailMessage.setText(notification.getMessage());
                mailMessage.setFrom("notification@tasksystem.com");

                mailSender.send(mailMessage);

                notification.setStatus(NotificationStatus.SENT);
                notification.setSentAt(LocalDateTime.now());
            } catch (Exception e) {
                System.err.println("Failed to send notification ID " + notification.getId() + ": " + e.getMessage());
                e.printStackTrace();
                notification.setStatus(NotificationStatus.FAILED);
            }
        }

        notificationRepository.saveAll(pending);
    }
}
