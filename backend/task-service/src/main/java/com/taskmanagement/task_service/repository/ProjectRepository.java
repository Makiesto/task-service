package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.dto.ProjectDetailsDTO;
import com.taskmanagement.task_service.entity.Project;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = {"tasks"})
    boolean existsByName(@NotBlank(message = "Project name is required") String name);

        Optional<Project> findWithTasksById(Long id);

}
