package com.taskmanagement.task_service.rabbitmq;

import com.taskmanagement.task_service.dto.TaskEventDTO;
import com.taskmanagement.task_service.dto.UserUpdateEventDTO;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserUpdateListener {

    private final TaskRepository taskRepository;
    private final RabbitTemplate rabbitTemplate;


    @Transactional
    @RabbitListener(queues = "${spring.rabbitmq.queue}")
    public void handleUserUpdate(UserUpdateEventDTO event) {
        System.out.println("Received message from RabbitMQ, change email  " + event.getOldEmail() + " to " + event.getNewEmail());

        List<Task> tasksToUpdate = taskRepository.findByAssignedToEmail(event.getOldEmail());

        if (tasksToUpdate.isEmpty()) {
            System.out.println("No tasks to update for email: " + event.getOldEmail());
            return;
        }

        tasksToUpdate.forEach(task -> {
            task.setAssignedToEmail(event.getNewEmail());

            TaskEventDTO notificationEvent = TaskEventDTO.builder()
                    .userId(event.getUserId())
                    .userEmail(event.getNewEmail())
                    .userName(event.getFirstName() + " " + event.getLastName())
                    .taskTitle(task.getTitle())
                    .deadline(task.getDeadline())
                    .eventType("TASK_EMAIL_CHANGED")
                    .build();

            rabbitTemplate.convertAndSend(
                "task_exchange",
                "task.event.email_changed",
                notificationEvent
            );

            System.out.println("Sent email change notification for task: " + task.getTitle());
        });

        taskRepository.saveAll(tasksToUpdate);
        System.out.println("Tasks updated for email " + event.getNewEmail());
    }
}
