package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Task;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    boolean existsByTitle(String title);

    boolean existsByTitleAndIdNot(@NotBlank(message = "Title is required") String title, Long id);
    List<Task> findByAssignedToEmail(String email);
}
