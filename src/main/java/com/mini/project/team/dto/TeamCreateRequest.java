package com.mini.project.team.dto;

import com.mini.project.team.domain.Team;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TeamCreateRequest {
    private String name;
    private Long dayOffReady;

    public TeamCreateRequest() {}

    public TeamCreateRequest(Team team) {
        this.name = team.getName();
        this.dayOffReady = team.getDayOffReady();
    }
}
