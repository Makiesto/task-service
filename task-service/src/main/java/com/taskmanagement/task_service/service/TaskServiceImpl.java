package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Task;
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
        Task task = taskRepository.findById(id).orElse(null);

        if (task == null) {
            throw new RuntimeException("Task not found with id: " + id);  // Temporary
        }

        return taskMapper.toDTO(task);
    }

    @Override
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = taskMapper.toEntity(taskDTO);
        Task taskCreated = taskRepository.save(task);

        System.out.println("Creating task: " + taskCreated.getTitle());
        return taskMapper.toDTO(taskCreated);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        // in future return own exception
        Task task = taskRepository.findById(id).orElse(null);

        if (task == null) {
            throw new RuntimeException("Task not found with id: " + id);  // Temporary
        }

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPriority(taskDTO.getPriority());
        task.setAssignedToEmail(taskDTO.getAssignedToEmail());
        task.setPriority(taskDTO.getPriority());
        task.setDeadline(taskDTO.getDeadline());
        task.setStatus(taskDTO.getStatus());
        taskRepository.save(task);
        System.out.println("Updating task: " + task.getTitle());
        return taskMapper.toDTO(task);


    }

    @Override
    public void deleteTask(Long id) {
        if (taskRepository.findById(id).isPresent()) {
            taskRepository.deleteById(id);
            System.out.println("Deleted task  with id: " + id);
        } else {
            System.out.println("Task with " + id + " not found");
        }
    }
}
