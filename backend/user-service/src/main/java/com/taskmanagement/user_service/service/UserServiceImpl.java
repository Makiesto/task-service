package com.taskmanagement.user_service.service;

import com.taskmanagement.user_service.dto.UserRequestDTO;
import com.taskmanagement.user_service.dto.UserResponseDTO;
import com.taskmanagement.user_service.dto.UserUpdateEventDTO;
import com.taskmanagement.user_service.entity.Team;
import com.taskmanagement.user_service.entity.User;
import com.taskmanagement.user_service.entity.UserRole;
import com.taskmanagement.user_service.mapper.UserMapper;
import com.taskmanagement.user_service.repository.TeamRepository;
import com.taskmanagement.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final TeamRepository teamRepository;

    private final UserMapper userMapper;

    private final RabbitTemplate rabbitTemplate;

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
        // TODO: Hash password

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
}
