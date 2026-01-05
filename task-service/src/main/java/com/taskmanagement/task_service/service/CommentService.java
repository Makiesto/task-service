package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.CommentDTO;

import java.util.List;

public interface CommentService {
    public CommentDTO addComment(CommentDTO commentDTO);
    public List<CommentDTO> getCommentsByTaskId(Long taskId);
    public void deleteComment(Long id);

}
