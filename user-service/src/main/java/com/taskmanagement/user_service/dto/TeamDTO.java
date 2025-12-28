package com.taskmanagement.user_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TeamDTO {

    private Long id;
    private String name;
    private String description;

    private List<TeamMemberDTO> members;
}
