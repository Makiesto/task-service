package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.CommentDTO;
import com.taskmanagement.task_service.entity.Comment;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.mapper.CommentMapper;
import com.taskmanagement.task_service.repository.CommentRepository;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final CommentMapper commentMapper;

    @Override
    public CommentDTO addComment(CommentDTO commentDTO) {
        Task task = taskRepository.findById(commentDTO.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Comment comment = commentMapper.toEntity(commentDTO);
        comment.setTask(task);

        return commentMapper.toDTO(commentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {
        return commentMapper.toDTOList(commentRepository.findByTaskId(taskId));
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}