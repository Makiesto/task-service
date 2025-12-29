package com.taskmanagement.user_service.mapper;

import com.taskmanagement.user_service.dto.TeamDTO;
import com.taskmanagement.user_service.dto.TeamMemberDTO;
import com.taskmanagement.user_service.entity.Team;
import com.taskmanagement.user_service.entity.TeamMember;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring")
public interface TeamMapper {

    TeamDTO toDTO(Team team);
    Team toEntity(TeamDTO teamDTO);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "user.role", target = "role")
    @Mapping(source = "joinedAt", target = "joinedAt")
    TeamMemberDTO toMemberDTO(TeamMember member);

    List<TeamDTO> toDTOList(List<Team> teams);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "members", ignore = true)
    void updateEntityFromDTO(TeamDTO teamDTO, @MappingTarget Team team);
}
