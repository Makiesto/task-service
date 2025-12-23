package com.taskmanagement.user_service.service;

import com.taskmanagement.user_service.dto.UserRequestDTO;
import com.taskmanagement.user_service.dto.UserResponseDTO;
import com.taskmanagement.user_service.entity.UserRole;

import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);
    List<UserResponseDTO> findAllUsers();
    UserResponseDTO findUserById(Long id);
    UserResponseDTO findUserByEmail(String email);

    List<UserResponseDTO> findUsersByRole(UserRole role);

    UserResponseDTO updateUser(Long id, UserRequestDTO user);
    void deleteUser(Long id);
}
