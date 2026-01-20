package com.taskmanagement.user_service.service;

import com.taskmanagement.user_service.dto.*;
import com.taskmanagement.user_service.entity.UserRole;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    List<UserResponseDTO> findAllUsers();

    UserResponseDTO findUserById(Long id);

    UserResponseDTO findUserByEmail(String email);

    List<UserResponseDTO> findUsersByRole(UserRole role);

    UserResponseDTO updateUser(Long id, UserRequestDTO user);

    void deleteUser(Long id);

    boolean existsById(Long id);

    List<UserResponseDTO> getUsersByTeamId(Long teamId);

    List<UserResponseDTO> getUsersByTeamName(String teamName);

    List<UserResponseDTO> getUsersWithoutTeam();

    LoginResponseDTO login(@Valid LoginRequestDTO loginRequestDTO);

    UserResponseDTO updateProfile(Long id, UserRequestDTO userRequestDTO);

    void changePassword(Long id, ChangePasswordDTO changePasswordDTO);

    List<UserResponseDTO> getVisibleUsersForDeveloper(String developerEmail);

}
