package com.taskmanagement.user_service.mapper;

import com.taskmanagement.user_service.dto.UserRequestDTO;
import com.taskmanagement.user_service.dto.UserResponseDTO;
import com.taskmanagement.user_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRequestDTO dto);

    @Mapping(source = "team.name", target = "teamName")
    UserResponseDTO toResponseDTO(User user);

    @Mapping(source = "team.name", target = "teamName")
    List<UserResponseDTO> toResponseDTOList(List<User> users);

    void updateEntityFromDTO(UserRequestDTO userRequestDTO,  @MappingTarget User user);
}
