package com.taskmanagement.user_service.service;

import com.taskmanagement.user_service.dto.*;
import com.taskmanagement.user_service.entity.Team;
import com.taskmanagement.user_service.entity.User;
import com.taskmanagement.user_service.entity.UserRole;
import com.taskmanagement.user_service.mapper.UserMapper;
import com.taskmanagement.user_service.repository.TeamRepository;
import com.taskmanagement.user_service.repository.UserRepository;
import com.taskmanagement.user_service.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final UserMapper userMapper;
    private final RabbitTemplate rabbitTemplate;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.rabbitmq.exchange.user}")
    private String userExchange;

    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {

        // future improvement - add own exception
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        User user = userMapper.toEntity(userRequestDTO);

        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        User saved = setTeamName(userRequestDTO, user);
        System.out.println("Creating user with name: " + saved.getFirstName());

        return userMapper.toResponseDTO(saved);
    }

    @Override
    public List<UserResponseDTO> findAllUsers() {

        List<User> users = userRepository.findAll();
        System.out.println("Found all users: " + users);

        return userMapper.toResponseDTOList(users);
    }

    @Override
    public UserResponseDTO findUserById(Long id) {

        // in future return own exception
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        return userMapper.toResponseDTO(user);
    }

    @Override
    public UserResponseDTO findUserByEmail(String email) {

        // in future return own exception
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return userMapper.toResponseDTO(user);

    }

    @Override
    public List<UserResponseDTO> findUsersByRole(UserRole role) {

        // in future return own exception
        List<User> users = userRepository.findByRole(role);
        if (users.isEmpty()) {
            throw new RuntimeException("No users found with role: " + role);
        }

        return userMapper.toResponseDTOList(users);
    }

    @Override
    public List<UserResponseDTO> findUsersByTeamName(String teamName) {

        if (!teamRepository.existsByName(teamName)) {
            throw new RuntimeException("Team not found");
        }

        List<User> users = userRepository.findByTeamName(teamName);

        return userMapper.toResponseDTOList(users);
    }

    @Transactional
    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO userRequestDTO) {

        // in future return own exception
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        String oldEmail = user.getEmail();

        if (!oldEmail.equals(userRequestDTO.getEmail()) && userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        userMapper.updateEntityFromDTO(userRequestDTO, user);

        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        System.out.println("Updating user: " + user.getEmail());

        User saved = setTeamName(userRequestDTO, user);

        UserUpdateEventDTO event = new UserUpdateEventDTO(
                saved.getId(),
                oldEmail,
                saved.getEmail(),
                saved.getFirstName(),
                saved.getLastName()
        );

        rabbitTemplate.convertAndSend(userExchange, "user.update", event);

        return userMapper.toResponseDTO(saved);
    }

    private User setTeamName(UserRequestDTO userRequestDTO, User user) {
        if (userRequestDTO.getTeamName() != null && !userRequestDTO.getTeamName().isBlank()) {
            Team team = teamRepository.findByName(userRequestDTO.getTeamName())
                    .orElseThrow(() -> new RuntimeException("Team not found: " + userRequestDTO.getTeamName()));
            user.setTeam(team);
        } else {
            user.setTeam(null);
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {

        // in future return own exception
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);
        rabbitTemplate.convertAndSend(userExchange, "user.event.deleted", id);
        System.out.println("Deleted user with id: " + id);
    }

    @Override
    public boolean existsById(Long id) {
        System.out.println("Checking existence of user with id: " + id);
        return userRepository.existsById(id);
    }

    @Override
    public List<UserResponseDTO> getUsersWithoutTeam() {
        List<User> users = userRepository.findAllByTeamIsNull();
        return userMapper.toResponseDTOList(users);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().toString()
        );

        return LoginResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .token(token)
                .message("Login successful")
                .build();
    }

    @Override
    @Transactional
    public UserResponseDTO updateProfile(Long id, UserRequestDTO userRequestDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setFirstName(userRequestDTO.getFirstName());
        user.setLastName(userRequestDTO.getLastName());
        user.setEmail(userRequestDTO.getEmail());

        User saved = userRepository.save(user);
        System.out.println("Profile updated for user: " + user.getEmail());

        return userMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void changePassword(Long id, ChangePasswordDTO changePasswordDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(user);

        System.out.println("Password changed for user: " + user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getVisibleUsersForDeveloper(String developerEmail) {
        User developer = userRepository.findByEmail(developerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<User> visibleUsers = new HashSet<>();

        visibleUsers.add(developer);

        if (developer.getTeam() != null) {
            List<User> teamMembers = userRepository.findByTeamId(developer.getTeam().getId());
            visibleUsers.addAll(teamMembers);
        }

        return visibleUsers.stream()
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
