package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.entity.Project;
import com.taskmanagement.task_service.mapper.ProjectMapper;
import com.taskmanagement.task_service.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {

        if (projectRepository.existsByName(projectDTO.getName())) {
            throw new RuntimeException("Project with name '" + projectDTO.getName() + "' already exists");
        }

        Project project = projectMapper.toEntity(projectDTO);
        Project savedProject = projectRepository.save(project);
        System.out.println("Creating new project: " + projectDTO.getName());

        return projectMapper.toDTO(savedProject);
    }

    @Override
    @Transactional
    public List<ProjectDTO> findAllProjects() {
        System.out.println("Finding all projects");

        List<Project> projects = projectRepository.findAll();
        return projectMapper.toDTOList(projects);
    }

    @Override
    @Transactional
    public ProjectDTO findProjectById(Long id) {
        System.out.println("Finding project with id: " + id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        ProjectDTO dto = projectMapper.toDTO(project);
        dto.setNumberOfTasks(project.getTasks() != null ? project.getTasks().size() : 0);
        return dto;
    }

    @Override
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        System.out.println("Updating project with id: " + id);

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        if (!existingProject.getName().equals(projectDTO.getName()) &&
                projectRepository.existsByName(projectDTO.getName())) {
            throw new RuntimeException("Project name already exists");
        }

        projectMapper.updateEntityFromDTO(projectDTO, existingProject);
        Project updatedProject = projectRepository.save(existingProject);

        return projectMapper.toDTO(updatedProject);
    }

    @Override
    public void deleteProject(Long id) {
        System.out.println("Deleting project with id: " + id);
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
}
