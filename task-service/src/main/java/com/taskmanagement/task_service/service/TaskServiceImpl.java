package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.exception.DuplicateTitleException;
import com.taskmanagement.task_service.mapper.TaskMapper;
import com.taskmanagement.task_service.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper taskMapper;

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

        if (taskRepository.existsByTitle(taskDTO.getTitle())) {
            throw new DuplicateTitleException("Task with this title already exists");
        }

        Task taskCreated = taskRepository.save(taskMapper.toEntity(taskDTO));

        System.out.println("Creating task: " + taskCreated.getTitle());
        return taskMapper.toDTO(taskCreated);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        // in future return own exception

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

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
}
