package com.mini.project.team.controller;

import com.mini.project.team.domain.Team;
import com.mini.project.team.dto.TeamCreateRequest;
import com.mini.project.team.dto.TeamEmployeesResponse;
import com.mini.project.team.dto.TeamResponse;
import com.mini.project.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TeamController {
    private final TeamService service;

    @GetMapping("/teams")
    public List<TeamResponse> getTeams() {
        List<Team> teams = service.findByDelYn();
        List<TeamResponse> res = new ArrayList<>();
        for (Team t : teams) {
            res.add(new TeamResponse(t));
        }
        return res;
    }

    @GetMapping("/team")
    public Page<TeamResponse> getTeams(@RequestParam(required = false) String name, @RequestParam(required = false) String managerName, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return service.getTeams(name, managerName, pageable);
    }

    @PostMapping("/team")
    public void addTeam(@RequestBody TeamCreateRequest request) {
        service.addTeam(request);
    }

//    @GetMapping("/team/{id}")
//    public TeamCreateRequest getTeam(@PathVariable Long id) {
//        Team orgTeam = service.findById(id).get();
//        return new TeamCreateRequest(orgTeam);
//    }
    @GetMapping("/team/{id}")
    public Map<String, Object> getTeam(@PathVariable Long id) {
        Map<String, Object> res = new HashMap<>();

        Team orgTeam = service.findById(id).get();
        res.put("team", new TeamCreateRequest(orgTeam));

        List<TeamEmployeesResponse> employees = service.findEmployeesOfTeam(id);
        res.put("list", employees);

        return res;
    }

    @PutMapping("/team/{id}")
    public void updateTeam(@RequestBody TeamCreateRequest team, @PathVariable Long id) {
        service.updateTeam(team, id);
    }

    @DeleteMapping("/team/{id}")
    public void deleteTeam(@PathVariable Long id) {
        service.deleteTeam(id);
    }
}
