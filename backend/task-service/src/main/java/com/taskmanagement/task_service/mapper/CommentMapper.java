package com.taskmanagement.task_service.mapper;

import com.taskmanagement.task_service.dto.CommentDTO;
import com.taskmanagement.task_service.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "taskId", source = "task.id")
    CommentDTO toDTO(Comment comment);

    List<CommentDTO> toDTOList(List<Comment> comments);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "task", ignore = true)
    Comment toEntity(CommentDTO commentDTO);
}