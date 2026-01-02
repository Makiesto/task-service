package com.taskmanagement.user_service.mapper;

import com.taskmanagement.user_service.dto.TeamDTO;
import com.taskmanagement.user_service.entity.Team;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;


@Mapper(componentModel = "spring")
public interface TeamMapper {

    TeamDTO toDTO(Team team);
    Team toEntity(TeamDTO teamDTO);

    List<TeamDTO> toDTOList(List<Team> teams);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "members", ignore = true)
    void updateEntityFromDTO(TeamDTO teamDTO, @MappingTarget Team team);
}
