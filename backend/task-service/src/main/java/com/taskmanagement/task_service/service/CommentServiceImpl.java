package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.client.UserClient;
import com.taskmanagement.task_service.dto.CommentDTO;
import com.taskmanagement.task_service.entity.Comment;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.exception.UserNotFoundException;
import com.taskmanagement.task_service.mapper.CommentMapper;
import com.taskmanagement.task_service.repository.CommentRepository;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final CommentMapper commentMapper;
    private final UserClient userClient;

    @Override
    public CommentDTO addComment(CommentDTO commentDTO) {
        Task task = taskRepository.findById(commentDTO.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!userClient.checkIfUserExists(commentDTO.getUserId())) {
            throw new UserNotFoundException("User with ID " + commentDTO.getUserId() + " does not exist!");
        }

        Comment comment = commentMapper.toEntity(commentDTO);
        comment.setTask(task);

        return commentMapper.toDTO(commentRepository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId) {
        List<Comment> comments = commentRepository.findByTaskId(taskId);

        if (comments.isEmpty()) return Collections.emptyList();

        return commentMapper.toDTOList(comments);
    }

    @Override
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        commentRepository.delete(comment);
        System.out.println("Deleted comment with id: " + id);
    }
}