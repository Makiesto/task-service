package com.taskmanagement.user_service.service;

import com.taskmanagement.user_service.dto.TeamDTO;
import com.taskmanagement.user_service.entity.Team;
import com.taskmanagement.user_service.mapper.TeamMapper;
import com.taskmanagement.user_service.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;

    private final TeamMapper teamMapper;


    @Override
    public TeamDTO createTeam(TeamDTO teamDTO) {

        // future improvement - add own exception
        if (teamRepository.existsByName(teamDTO.getName())) {
            throw new RuntimeException("Team already exists");
        }

        Team team = teamMapper.toEntity(teamDTO);

        if (team.getMembers() == null) {
            team.setMembers(new ArrayList<>());
        }

        System.out.println("Creating team with name: " + team.getName());

        return teamMapper.toDTO(teamRepository.save(team));
    }

    @Override
    public List<TeamDTO> findAllTeams() {

        List<Team> teams = teamRepository.findAll();
        System.out.println("Found all teams: " + teams);

        return teamMapper.toDTOList(teams);
    }

    @Override
    public TeamDTO findTeamById(Long id) {

        // in future return own exception
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));

        return teamMapper.toDTO(team);
    }

    @Override
    public TeamDTO findTeamByName(String name) {

        // in future return own exception
        Team team = teamRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Team not found with name: " + name));

        return teamMapper.toDTO(team);
    }

    @Override
    public TeamDTO updateTeam(Long id, TeamDTO teamDTO) {

        // in future return own exception
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));

        teamMapper.updateEntityFromDTO(teamDTO, team);
        System.out.println("Updating team: " + team.getName());

        return teamMapper.toDTO(teamRepository.save(team));
    }

    @Override
    public void deleteTeam(Long teamId) {

        // in future return own exception
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));

        teamRepository.delete(team);
        System.out.println("Deleted team with id: " + teamId);
    }
}
