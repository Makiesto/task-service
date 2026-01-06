package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Task;
import org.springframework.data.repository.query.Param;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    boolean existsByTitle(String title);

    boolean existsByTitleAndIdNot(@NotBlank(message = "Title is required") String title, Long id);

    List<Task> findByAssignedToEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE Task t SET t.assignedToEmail = null WHERE t.assignedToEmail = :email")
    void nullifyAssignedTasksByEmail(@Param("email") String email);
}
