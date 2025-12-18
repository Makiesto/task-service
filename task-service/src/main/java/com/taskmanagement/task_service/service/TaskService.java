package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Task;

import java.util.List;

public interface TaskService {
    List<TaskDTO> findAllTasks();
    TaskDTO findTaskById(Long id);
    TaskDTO createTask(TaskDTO task);
    TaskDTO updateTask(Long id, TaskDTO task);
    void deleteTask(Long id);

}
