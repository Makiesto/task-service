package com.taskmanagement.task_service.rabbitmq;

import com.taskmanagement.task_service.dto.UserUpdateEventDTO;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserUpdateListener {

    private final TaskRepository taskRepository;


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
        });

        taskRepository.saveAll(tasksToUpdate);
        System.out.println("Tasks updated for email " + event.getNewEmail());
    }
}
