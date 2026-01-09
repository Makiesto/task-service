package com.taskmanagement.user_service.service;


import com.taskmanagement.user_service.dto.TeamDTO;
import com.taskmanagement.user_service.dto.UserResponseDTO;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface TeamService {
    TeamDTO createTeam(TeamDTO teamDTO);
    List<TeamDTO> findAllTeams();
    TeamDTO findTeamById(Long id);
    TeamDTO findTeamByName(String name);
    TeamDTO updateTeam(Long id, TeamDTO teamDTO);
    void deleteTeam(Long teamId);

    List<UserResponseDTO> getTeamMembers(String name);
    UserResponseDTO addUserToTeam(Long teamId, Long userId);
    void removeUserFromTeam(Long teamId, Long userId);
}
