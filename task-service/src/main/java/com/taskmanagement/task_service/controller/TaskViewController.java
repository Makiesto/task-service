package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Priority;
import com.taskmanagement.task_service.entity.TaskStatus;
import com.taskmanagement.task_service.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/tasks")
public class TaskViewController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/index")
    public String getAllTasks(Model model) {

        List<TaskDTO> tasks = taskService.findAllTasks();
        model.addAttribute("tasks", tasks);

        return "index";
    }

    @GetMapping("/add")
    public String showAddTask(Model model) {
        TaskDTO task = new TaskDTO();

        task.setPriority(Priority.MEDIUM);
        task.setStatus(TaskStatus.TODO);

        model.addAttribute("task", task);
        model.addAttribute("priorities", Priority.values());
        model.addAttribute("statuses", TaskStatus.values());

        return "add-task";
    }

    @PostMapping("/add")
    public String addTask(@Valid TaskDTO task, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("task", task);

            return "add-task";
        }

        taskService.createTask(task);
        return "redirect:/index";
    }


    @GetMapping("/edit/{id}")
    public String showUpdateForm(@PathVariable("id") long id, Model model) {
        TaskDTO task = taskService.findTaskById(id);

        model.addAttribute("task", task);
        return "update-task";
    }

    @PostMapping("/update/{id}")
    public String updateTask(@PathVariable("id") long id, @Valid TaskDTO task,
                             BindingResult result) {
        if (result.hasErrors()) {
            System.out.println("error occured in updateTask method");
            task.setId(id);

            return "update-task";
        }

        taskService.updateTask(id, task);
        return "redirect:/tasks/index";
    }

    @GetMapping("/delete/{id}")
    public String deleteTask(@PathVariable("id") long id) {
        TaskDTO task = taskService.findTaskById(id);
        taskService.deleteTask(id);

        return "redirect:/index";
    }
}
