package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<Task> findAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        System.out.println("Found all tasks: " + tasks);
        return tasks;
    }

    @Override
    public Task findTaskById(Long id) {

        Task task = taskRepository.findById(id).get();
        System.out.println("Found task with id: " + id + ": " + task.getTitle());

        return task;
    }

    @Override
    public Task createTask(Task task) {
        Task taskCreated = taskRepository.save(task);
        System.out.println("Creating task: " + taskCreated.getTitle());
        return taskCreated;
    }

    @Override
    public Task updateTask(Task task) {
        if (taskRepository.findById(task.getId()).isPresent()) {
            taskRepository.save(task);
            System.out.println("Updated task");
            return task;
        } else {
            System.out.println("Task not found");
        }

        return null;
    }

    @Override
    public void deleteTask(Long id) {
        if (taskRepository.findById(id).isPresent()) {
            taskRepository.deleteById(id);
            System.out.println("Deleted task  with id: " + id);
        } else {
            System.out.println("Deleted task with id: " + id);
        }
    }
}
