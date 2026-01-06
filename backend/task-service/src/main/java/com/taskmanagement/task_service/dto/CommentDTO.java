package com.taskmanagement.task_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;

    @NotBlank(message = "Comment content is required")
    private String content;

    private LocalDateTime createdAt;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Task ID is required")
    private Long taskId;
}