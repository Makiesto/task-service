package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.dto.ProjectDetailsDTO;
import com.taskmanagement.task_service.entity.Project;

import java.util.List;

public interface ProjectService {
    ProjectDTO createProject(ProjectDTO projectDTO);

    List<ProjectDTO> findAllProjects(String userRole, String userEmail);

    ProjectDTO findProjectById(Long id);

    ProjectDetailsDTO getProjectDetails(Long id);

    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);

    void deleteProject(Long id);
}
