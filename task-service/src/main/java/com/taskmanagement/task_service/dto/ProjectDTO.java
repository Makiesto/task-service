package com.taskmanagement.task_service.dto;

import jakarta.validation.constraints.NotBlank;


public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    private Integer numberOfTasks;
}
