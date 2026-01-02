package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.client.UserClient;
import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.dto.TaskEventDTO;
import com.taskmanagement.task_service.dto.UserDTO;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.entity.TaskStatus;
import com.taskmanagement.task_service.exception.DeadlineBeforeTodayException;
import com.taskmanagement.task_service.exception.DuplicateTitleException;
import com.taskmanagement.task_service.mapper.TaskMapper;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    private final TaskMapper taskMapper;

    private final UserClient userClient;

    private final RabbitTemplate rabbitTemplate;

    @Override
    public List<TaskDTO> findAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        System.out.println("Found all tasks: " + tasks);

        return taskMapper.toDTOList(tasks);
    }

    @Override
    public TaskDTO findTaskById(Long id) {
        // in future return own exception
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        return taskMapper.toDTO(task);
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {

        validateAssignedUser(taskDTO.getAssignedToEmail());

        if (taskRepository.existsByTitle(taskDTO.getTitle())) {
            throw new DuplicateTitleException("Task with this title already exists");
        }

        if (taskDTO.getDeadline().isBefore(LocalDateTime.now())) {
            throw new DeadlineBeforeTodayException("Task deadline cannot be set in past");
        }

        Task taskEntity = taskMapper.toEntity(taskDTO);
        System.out.println("Creating task: " + taskEntity.getTitle());

        Task savedTask = taskRepository.save(taskEntity);

        if (savedTask.getAssignedToEmail() != null) {

            UserDTO user = userClient.getUserByEmail(savedTask.getAssignedToEmail());

            TaskEventDTO event = TaskEventDTO.builder()
                    .userId(user.getId())
                    .userEmail(user.getEmail())
                    .userName(user.getFirstName() + " " + user.getLastName())
                    .taskTitle(savedTask.getTitle())
                    .deadline(savedTask.getDeadline())
                    .eventType("TASK_CREATED")
                    .build();

            rabbitTemplate.convertAndSend(
                    "task_exchange",
                    "task.event.created",
                    event
            );
            System.out.println("Sent TASK_CREATED event for task: " + savedTask.getTitle());
        }

        return taskMapper.toDTO(savedTask);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {

        // in future return own exception
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        validateAssignedUser(taskDTO.getAssignedToEmail());

        if (taskRepository.existsByTitleAndIdNot(taskDTO.getTitle(), id)) {
            throw new DuplicateTitleException("Task with this title already exists");
        }

        if (taskDTO.getDeadline().isBefore(LocalDateTime.now())) {
            throw new DeadlineBeforeTodayException("Task deadline cannot be set in past");
        }

        taskMapper.updateEntityFromDTO(taskDTO, task);
        System.out.println("Updating task: " + task.getTitle());

        return taskMapper.toDTO(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {
        // in future return own exception

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        taskRepository.delete(task);
        System.out.println("Deleted task  with id: " + id);

    }

    @Override
    public TaskDTO assignTaskToUser(Long id, String assignedToEmail) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        validateAssignedUser(assignedToEmail);

        UserDTO user = userClient.getUserByEmail(assignedToEmail);

        task.setAssignedToEmail(assignedToEmail);
        System.out.println("Assigning task: " + task.getTitle());

        Task savedTask = taskRepository.save(task);

        TaskEventDTO event = TaskEventDTO.builder()
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFirstName() + " " + user.getLastName())
                .taskTitle(savedTask.getTitle())
                .deadline(savedTask.getDeadline())
                .eventType("TASK_ASSIGNED")
                .build();

        rabbitTemplate.convertAndSend(
                "task_exchange",
                "task.event.assigned",
                event
        );

        return taskMapper.toDTO(savedTask);

    }

    @Override
    public TaskDTO updateTaskStatus(Long id, String newStatus) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        TaskStatus oldStatus = task.getStatus();

        task.setStatus(TaskStatus.valueOf(newStatus.toUpperCase()));
        System.out.println("Updating task: " + task.getTitle());

        Task savedTask = taskRepository.save(task);

        if (savedTask.getStatus() == TaskStatus.DONE && oldStatus != TaskStatus.DONE) {
            if (savedTask.getAssignedToEmail() != null) {
                UserDTO user = userClient.getUserByEmail(savedTask.getAssignedToEmail());

                TaskEventDTO event = TaskEventDTO.builder()
                        .userId(user.getId())
                        .userEmail(user.getEmail())
                        .userName(user.getFirstName() + " " + user.getLastName())
                        .taskTitle(savedTask.getTitle())
                        .deadline(savedTask.getDeadline())
                        .eventType("TASK_DONE")
                        .build();

                rabbitTemplate.convertAndSend(
                        "task_exchange",
                        "task.event.completed",
                        event
                );
            }
        }

        return taskMapper.toDTO(savedTask);
    }

    private void validateAssignedUser(String email) {
        if (email != null && !email.isBlank()) {
            System.out.println("Validating user exists: " + email);

            try {
                UserDTO userDTO = userClient.getUserByEmail(email);
                System.out.println("User validation successful:" + userDTO.getEmail());
            } catch (Exception e) {
                System.out.println("User validation failed for email: " + email + ": " + e.getMessage());
                throw new RuntimeException("User not found: " + email, e);
            }
        } else {
            System.out.println("No user assigned, skipping validation");
        }
    }
}
