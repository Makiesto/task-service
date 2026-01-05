package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}
