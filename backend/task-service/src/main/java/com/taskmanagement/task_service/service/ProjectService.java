package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.dto.ProjectDetailsDTO;
import com.taskmanagement.task_service.entity.Project;

import java.util.List;

public interface ProjectService {
    List<ProjectDTO> findAllProjects();

    ProjectDTO findProjectById(Long id);

    ProjectDTO createProject(ProjectDTO projectDTO);

    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);

    void deleteProject(Long id);

    ProjectDetailsDTO getProjectDetails(Long id);
}
