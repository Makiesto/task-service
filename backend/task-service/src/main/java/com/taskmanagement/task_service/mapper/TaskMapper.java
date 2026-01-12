package com.taskmanagement.task_service.mapper;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "comments", ignore = true)
    Task toEntity(TaskDTO dto);

    @Mapping(target = "projectId", source = "task", qualifiedByName = "getProjectId")
    TaskDTO toDTO(Task task);

    List<TaskDTO> toDTOList(List<Task> tasks);

    @Mapping(target = "project", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "comments", ignore = true)
    void updateEntityFromDTO(TaskDTO dto, @MappingTarget Task task);

    @Named("getProjectId")
    default Long getProjectId(Task task) {
        if (task == null || task.getProject() == null) {
            return null;
        }
        try {
            return task.getProject().getId();
        } catch (Exception e) {
            System.err.println("Error getting project ID: " + e.getMessage());
            return null;
        }
    }
}