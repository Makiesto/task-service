package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpClient;
import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/")
    public List<Task> getTasks() {

        return taskService.findAllTasks();
    }
}
