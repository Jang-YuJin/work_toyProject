package com.mini.project.team.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class TeamEmployeesResponse {
    private String name;
    private String isManager;

    public TeamEmployeesResponse(String name, String isManager) {
        this.name = name;
        this.isManager = isManager;
    }
}
