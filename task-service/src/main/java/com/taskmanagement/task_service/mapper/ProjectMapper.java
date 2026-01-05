package com.taskmanagement.task_service.mapper;

import com.taskmanagement.task_service.dto.ProjectDTO;
import com.taskmanagement.task_service.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "numberOfTasks", expression = "java(project.getTasks() != null ? project.getTasks().size() : 0)")
    ProjectDTO toDTO(Project project);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    Project toEntity(ProjectDTO projectDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tasks", ignore = true)
    void updateEntityFromDTO(ProjectDTO projectDTO, @MappingTarget Project project);
}