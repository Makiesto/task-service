package com.taskmanagement.user_service.controller;

import com.taskmanagement.user_service.dto.TeamDTO;
import com.taskmanagement.user_service.dto.UserResponseDTO;
import com.taskmanagement.user_service.service.TeamServiceImpl;
import com.taskmanagement.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamRestContoller {

    private final TeamServiceImpl teamService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.findAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.findTeamById(id));
    }

    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamService.createTeam(teamDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable Long id, @RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamService.updateTeam(id, teamDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<TeamDTO> getTeamsByName(@PathVariable String name) {
        return ResponseEntity.ok(teamService.findTeamByName(name));
    }

    @GetMapping("/name/{name}/users")
    public ResponseEntity<List<UserResponseDTO>> getUsersByTeamName(@PathVariable String name) {
        List<UserResponseDTO> users = userService.findUsersByTeamName(name);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{teamId}/users/{userId}")
    public ResponseEntity<UserResponseDTO> addUserToTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.addUserToTeam(teamId, userId));
    }

    @DeleteMapping("/{teamId}/users/{userId}")
    public ResponseEntity<Void> removeUserFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        teamService.removeUserFromTeam(teamId, userId);
        return ResponseEntity.noContent().build();
    }
}
