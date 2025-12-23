package com.taskmanagement.user_service.repository;

import com.taskmanagement.user_service.dto.UserResponseDTO;
import com.taskmanagement.user_service.entity.User;
import com.taskmanagement.user_service.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    Optional<List<User>> findByUserRole(UserRole role);
}
