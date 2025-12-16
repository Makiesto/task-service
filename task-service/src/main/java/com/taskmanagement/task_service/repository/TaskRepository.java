package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
