package com.taskmanagement.task_service.mapper;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toEntity(TaskDTO dto);
    TaskDTO toDTO(Task task);
    List<TaskDTO> toDTOList(List<Task> tasks);

    void updateEntityFromDTO(TaskDTO dto, @MappingTarget Task task);
}