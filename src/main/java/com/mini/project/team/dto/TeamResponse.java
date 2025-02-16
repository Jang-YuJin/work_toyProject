package com.mini.project.team.dto;

import com.mini.project.team.domain.Team;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//@NoArgsConstructor
public class TeamResponse {
    private Long id;
    private String name;
    private String managerName;
    private long memberCount;

    public TeamResponse(Long id, String name, long memberCount, String managerName) {
        this.id = id;
        this.name = name;
        this.managerName = managerName;
        this.memberCount = memberCount;
    }

    public TeamResponse(Team team) {
        this.id = team.getId();
        this.name = team.getName();
    }
}
