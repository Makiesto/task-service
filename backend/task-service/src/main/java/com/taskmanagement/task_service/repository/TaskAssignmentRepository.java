package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByTaskId(Long taskId);
    void deleteByTaskIdAndUserEmail(Long taskId, String userEmail);
    boolean existsByTaskIdAndUserEmail(Long taskId, String userEmail);
}