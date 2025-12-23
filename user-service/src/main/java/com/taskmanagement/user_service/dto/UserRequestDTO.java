package com.taskmanagement.user_service.dto;

import com.taskmanagement.user_service.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserRequestDTO {

    private String email;
    private String name;
    private String password;
    private UserRole role;

}
