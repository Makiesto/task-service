package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Priority;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.entity.TaskStatus;
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

    List<Task> findByAssignedToEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE Task t SET t.assignedToEmail = null WHERE t.assignedToEmail = :email")
    void nullifyAssignedTasksByEmail(@Param("email") String email);

    Long countByAssignedToEmail(String email);

    Long countByAssignedToEmailAndStatus(String email, TaskStatus status);

    Long countByAssignedToEmailAndPriority(String email,
                                           Priority priority);

}
