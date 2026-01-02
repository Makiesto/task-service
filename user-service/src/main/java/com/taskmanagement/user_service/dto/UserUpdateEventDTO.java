package com.taskmanagement.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateEventDTO {
    private Long userId;
    private String oldEmail;
    private String newEmail;
    private String firstName;
    private String lastName;
}
