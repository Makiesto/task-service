package com.taskmanagement.user_service.dto;

import com.taskmanagement.user_service.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResponseDTO {
    private Long id;
    private String email;
    private String name;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
