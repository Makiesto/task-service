package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.dto.ProjectDetailsDTO;
import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Priority;
import com.taskmanagement.task_service.entity.Project;
import com.taskmanagement.task_service.entity.TaskStatus;
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
    @Transactional(readOnly = true)

    public ProjectDetailsDTO getProjectDetails(Long id) {
        System.out.println("Finding project details with id: " + id);

        if (id == null) {
            throw new IllegalArgumentException("Project ID cannot be null");
        }

        Project project = projectRepository.findWithTasksById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

        List<TaskDTO> tasks = project.getTasks() != null
                ? project.getTasks().stream()
                .map(task -> {
                    TaskDTO dto = new TaskDTO();
                    dto.setId(task.getId());
                    dto.setTitle(task.getTitle());
                    dto.setDescription(task.getDescription());
                    dto.setStatus(TaskStatus.valueOf(task.getStatus().name()));
                    dto.setPriority(Priority.valueOf(task.getPriority().name()));
                    dto.setAssignedToEmail(task.getAssignedToEmail());
                    dto.setDeadline(task.getDeadline());
                    dto.setProjectId(task.getProject() != null ? task.getProject().getId() : null);
                    return dto;
                })
                .toList()
                : List.of();

        System.out.println("Found project: " + project.getName() + " with " + tasks.size() + " tasks");

        ProjectDetailsDTO.ProjectStatsDTO stats = calculateProjectStats(tasks);

        return ProjectDetailsDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdAt(project.getCreatedAt())
                .tasks(tasks)
                .stats(stats)
                .build();
    }

    private ProjectDetailsDTO.ProjectStatsDTO calculateProjectStats(List<TaskDTO> tasks) {
        int total = tasks.size();
        int todo = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.TODO).count();
        int inProgress = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count();
        int done = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        int high = (int) tasks.stream().filter(t -> t.getPriority() == Priority.HIGH).count();
        int critical = (int) tasks.stream().filter(t -> t.getPriority() == Priority.CRITICAL).count();

        double completionRate = total > 0 ? (done * 100.0 / total) : 0.0;

        return ProjectDetailsDTO.ProjectStatsDTO.builder()
                .totalTasks(total)
                .todoTasks(todo)
                .inProgressTasks(inProgress)
                .doneTasks(done)
                .highPriorityTasks(high)
                .criticalPriorityTasks(critical)
                .completionRate(Math.round(completionRate * 100.0) / 100.0)
                .build();
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