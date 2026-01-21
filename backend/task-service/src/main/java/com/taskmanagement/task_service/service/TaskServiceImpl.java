package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.client.UserClient;
import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.dto.TaskEventDTO;
import com.taskmanagement.task_service.dto.UserDTO;
import com.taskmanagement.task_service.dto.UserTaskStatsDTO;
import com.taskmanagement.task_service.entity.Priority;
import com.taskmanagement.task_service.entity.Project;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.entity.TaskStatus;
import com.taskmanagement.task_service.entity.TaskAssignment;
import com.taskmanagement.task_service.exception.DeadlineBeforeTodayException;
import com.taskmanagement.task_service.mapper.TaskMapper;
import com.taskmanagement.task_service.repository.ProjectRepository;
import com.taskmanagement.task_service.repository.TaskRepository;
import com.taskmanagement.task_service.repository.TaskAssignmentRepository;
import com.taskmanagement.task_service.repository.CommentRepository;
import com.taskmanagement.task_service.repository.FileAttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;
    private final CommentRepository commentRepository;
    private final FileAttachmentRepository fileAttachmentRepository;

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
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        return taskMapper.toDTO(task);
    }

    @Override
    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO) {

        validateAssignedUser(taskDTO.getAssignedToEmail());

        if (taskDTO.getDeadline().isBefore(LocalDateTime.now())) {
            throw new DeadlineBeforeTodayException("Task deadline cannot be set in past");
        }

        Task taskEntity = taskMapper.toEntity(taskDTO);

        if (taskDTO.getProjectId() != null) {
            Project project = projectRepository.findById(taskDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + taskDTO.getProjectId()));
            taskEntity.setProject(project);
        } else {
            taskEntity.setProject(null);
        }

        System.out.println("Creating task: " + taskEntity.getTitle());
        Task savedTask = taskRepository.save(taskEntity);

        if (savedTask.getAssignedToEmail() != null && !savedTask.getAssignedToEmail().isBlank()) {
            UserDTO user = userClient.getUserByEmail(savedTask.getAssignedToEmail());

            TaskAssignment assignment = TaskAssignment.builder()
                    .task(savedTask)
                    .userId(user.getId())
                    .userEmail(user.getEmail())
                    .userName(user.getFirstName() + " " + user.getLastName())
                    .build();

            taskAssignmentRepository.save(assignment);
            System.out.println("Created TaskAssignment for user: " + user.getEmail());

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
    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        String oldEmail = task.getAssignedToEmail();
        validateAssignedUser(taskDTO.getAssignedToEmail());

        if (taskDTO.getDeadline().isBefore(LocalDateTime.now())) {
            throw new DeadlineBeforeTodayException("Task deadline cannot be set in past");
        }

        taskMapper.updateEntityFromDTO(taskDTO, task);
        System.out.println("Updating task: " + task.getTitle());

        if (taskDTO.getProjectId() != null) {
            Project project = projectRepository.findById(taskDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found with id: " + taskDTO.getProjectId()));
            task.setProject(project);
        } else {
            task.setProject(null);
        }

        Task savedTask = taskRepository.save(task);

        String newEmail = taskDTO.getAssignedToEmail();
        if (newEmail != null && !newEmail.isBlank() && !newEmail.equals(oldEmail)) {
            if (oldEmail != null && !oldEmail.isBlank()) {
                taskAssignmentRepository.deleteByTaskIdAndUserEmail(id, oldEmail);
            }

            UserDTO user = userClient.getUserByEmail(newEmail);
            TaskAssignment assignment = TaskAssignment.builder()
                    .task(savedTask)
                    .userId(user.getId())
                    .userEmail(user.getEmail())
                    .userName(user.getFirstName() + " " + user.getLastName())
                    .build();

            taskAssignmentRepository.save(assignment);
            System.out.println("Updated TaskAssignment for user: " + user.getEmail());
        } else if ((newEmail == null || newEmail.isBlank()) && oldEmail != null && !oldEmail.isBlank()) {
            taskAssignmentRepository.deleteByTaskIdAndUserEmail(id, oldEmail);
        }

        return taskMapper.toDTO(savedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        taskAssignmentRepository.deleteAll(
            taskAssignmentRepository.findByTaskId(id)
        );
        System.out.println("Deleted task assignments for task: " + id);

        commentRepository.deleteAll(
            commentRepository.findByTaskId(id)
        );
        System.out.println("Deleted comments for task: " + id);

        fileAttachmentRepository.deleteByTaskId(id);
        System.out.println("Deleted file attachments for task: " + id);

        taskRepository.delete(task);
        System.out.println("Deleted task with id: " + id);
    }

    @Override
    @Transactional
    public TaskDTO assignTaskToUser(Long id, String assignedToEmail) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        validateAssignedUser(assignedToEmail);

        UserDTO user = userClient.getUserByEmail(assignedToEmail);

        String oldEmail = task.getAssignedToEmail();
        task.setAssignedToEmail(assignedToEmail);
        System.out.println("Assigning task: " + task.getTitle());

        Task savedTask = taskRepository.save(task);

        if (oldEmail != null && !oldEmail.isBlank()) {
            taskAssignmentRepository.deleteByTaskIdAndUserEmail(id, oldEmail);
        }

        TaskAssignment assignment = TaskAssignment.builder()
                .task(savedTask)
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFirstName() + " " + user.getLastName())
                .build();

        taskAssignmentRepository.save(assignment);

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
                        .eventType("TASK_COMPLETED")
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

    @Override
    public UserTaskStatsDTO getUserTaskStats(String email) {
        Long total = taskRepository.countByAssignedToEmail(email);
        Long completed = taskRepository.countByAssignedToEmailAndStatus(email, TaskStatus.DONE);
        Long inProgress = taskRepository.countByAssignedToEmailAndStatus(email, TaskStatus.IN_PROGRESS);
        Long todo = taskRepository.countByAssignedToEmailAndStatus(email, TaskStatus.TODO);
        Long highPriority = taskRepository.countByAssignedToEmailAndPriority(email, Priority.HIGH);
        Long critical = taskRepository.countByAssignedToEmailAndPriority(email, Priority.CRITICAL);

        return UserTaskStatsDTO.builder()
                .userEmail(email)
                .totalTasks(total)
                .completedTasks(completed)
                .inProgressTasks(inProgress)
                .todoTasks(todo)
                .highPriorityTasks(highPriority)
                .criticalPriorityTasks(critical)
                .build();
    }
}