package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Project;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    boolean existsByName(@NotBlank(message = "Project name is required") String name);
}
