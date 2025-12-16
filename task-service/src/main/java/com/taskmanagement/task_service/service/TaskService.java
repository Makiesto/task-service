package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.entity.Task;

import java.util.List;

public interface TaskService {
    List<Task> findAllTasks();
    Task findTaskById(Long id);
    Task createTask(Task task);
    Task updateTask(Task task);
    void deleteTask(Long id);

}
