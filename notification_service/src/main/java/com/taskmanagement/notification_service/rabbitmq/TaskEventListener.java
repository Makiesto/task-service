package com.taskmanagement.notification_service.rabbitmq;

import com.taskmanagement.notification_service.dto.TaskEventDTO;
import com.taskmanagement.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${spring.rabbitmq.queue.notification}")
    public void onTaskEvent(TaskEventDTO event) {
        try {
            notificationService.createNotification(event);
        } catch (Exception e) {
            System.out.println("Failed to create notification for event: " + event);
        }
    }
}
