package com.taskmanagement.task_service.mapper;

import com.taskmanagement.task_service.dto.TaskDTO;
import com.taskmanagement.task_service.entity.Task;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toEntity(TaskDTO dto);

    TaskDTO toDTO(Task task);

    List<TaskDTO> toDTOList(List<Task> tasks);

//    List<Task> toEntityList(List<TaskDTO> taskDTOs);
}