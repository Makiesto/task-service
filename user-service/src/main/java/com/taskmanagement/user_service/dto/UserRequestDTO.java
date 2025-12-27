package com.taskmanagement.user_service.dto;

import com.taskmanagement.user_service.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserRequestDTO {

    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private UserRole role;

}
