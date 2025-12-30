package com.taskmanagement.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateEventDTO {
    private String oldEmail;
    private String newEmail;
    private String firstName;
    private String lastName;
}

