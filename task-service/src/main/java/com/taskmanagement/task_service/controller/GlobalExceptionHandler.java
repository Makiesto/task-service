package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.exception.DeadlineBeforeTodayException;
import com.taskmanagement.task_service.exception.DuplicateTitleException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateTitleException.class)
    public String handleDuplicateTitleException(Exception exception, Model model) {

        model.addAttribute("task", new TaskDTO());
        model.addAttribute("errorMessage", exception.getMessage());

        return "add-task";
    }

    @ExceptionHandler(DeadlineBeforeTodayException.class)
    public String handleDeadlineBeforeTodayException(Exception exception, Model model) {

        model.addAttribute("task", new TaskDTO());
        model.addAttribute("errorMessage", exception.getMessage());

        return "add-task";
    }
}
