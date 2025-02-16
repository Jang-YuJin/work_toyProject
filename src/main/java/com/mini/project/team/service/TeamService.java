package com.mini.project.team.service;

import com.mini.project.team.domain.Team;
import com.mini.project.team.dto.TeamCreateRequest;
import com.mini.project.team.dto.TeamEmployeesResponse;
import com.mini.project.team.dto.TeamResponse;
import com.mini.project.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository repository;

    @Transactional
    public Page<TeamResponse> getTeams(String name, String managerName, Pageable pageable) {
//        List<TeamResponse> teams = customRepository.findAllTeams(name);
//        return teams.stream().map(TeamResponse::new).collect(Collectors.toList());
        return repository.findAllTeams(name, managerName, pageable);
    }

    @Transactional
    public void addTeam(TeamCreateRequest request) {
        Team team = new Team();
        team.setName(request.getName());
        team.setDayOffReady(request.getDayOffReady());
        team.setRegDate(LocalDateTime.now());
        team.setDelYn(false);
        repository.save(team);
    }

    @Transactional
    public List<Team> findByDelYn() {
        return repository.findByDelYn(false);
    }

    @Transactional
    public Optional<Team> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public void updateTeam(TeamCreateRequest team, Long id) {
        try {
            Optional<Team> teamOptional = repository.findById(id);
            Team orgTeam = teamOptional.get();

            orgTeam.setName(team.getName());
            orgTeam.setDayOffReady(team.getDayOffReady());
            orgTeam.setUpdateDate(LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void deleteTeam(Long id) {
        Team team = repository.findById(id).get();
        team.setDelYn(true);
        team.setDelDate(LocalDateTime.now());
    }

    @Transactional
    public List<TeamEmployeesResponse> findEmployeesOfTeam(Long id) {
        return repository.findEmployeesOfTeam(id);
    }
}
