package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.client.UserClient;
import com.taskmanagement.task_service.dto.TaskAssignmentDTO;
import com.taskmanagement.task_service.dto.TaskEventDTO;
import com.taskmanagement.task_service.dto.UserDTO;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.entity.TaskAssignment;
import com.taskmanagement.task_service.repository.TaskAssignmentRepository;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskAssignmentService {

    private final TaskAssignmentRepository assignmentRepository;
    private final TaskRepository taskRepository;
    private final UserClient userClient;
    private final RabbitTemplate rabbitTemplate;

    @Transactional
    public List<TaskAssignmentDTO> assignUsersToTask(Long taskId, List<String> userEmails) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        List<TaskAssignment> existingAssignments = assignmentRepository.findByTaskId(taskId);
        for (TaskAssignment existing : existingAssignments) {
            if (!userEmails.contains(existing.getUserEmail())) {
                assignmentRepository.delete(existing);
            }
        }

        for (String email : userEmails) {
            if (!assignmentRepository.existsByTaskIdAndUserEmail(taskId, email)) {
                UserDTO user = userClient.getUserByEmail(email);

                TaskAssignment assignment = TaskAssignment.builder()
                        .task(task)
                        .userId(user.getId())
                        .userEmail(email)
                        .userName(user.getFirstName() + " " + user.getLastName())
                        .build();

                assignmentRepository.save(assignment);

                TaskEventDTO event = TaskEventDTO.builder()
                        .userId(user.getId())
                        .userEmail(email)
                        .userName(user.getFirstName() + " " + user.getLastName())
                        .taskTitle(task.getTitle())
                        .deadline(task.getDeadline())
                        .eventType("TASK_ASSIGNED")
                        .build();

                rabbitTemplate.convertAndSend(
                        "task_exchange",
                        "task.event.assigned",
                        event
                );

                System.out.println("Sent TASK_ASSIGNED event for user: " + email);
            }
        }

        return assignmentRepository.findByTaskId(taskId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskAssignmentDTO> getTaskAssignments(Long taskId) {
        return assignmentRepository.findByTaskId(taskId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeUserFromTask(Long taskId, String userEmail) {
        assignmentRepository.deleteByTaskIdAndUserEmail(taskId, userEmail);
    }

    private TaskAssignmentDTO toDTO(TaskAssignment assignment) {
        return TaskAssignmentDTO.builder()
                .id(assignment.getId())
                .taskId(assignment.getTask().getId())
                .userEmail(assignment.getUserEmail())
                .userName(assignment.getUserName())
                .assignedAt(assignment.getAssignedAt())
                .build();
    }
}