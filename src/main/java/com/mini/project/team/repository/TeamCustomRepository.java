package com.mini.project.team.repository;

import com.mini.project.team.dto.TeamEmployeesResponse;
import com.mini.project.team.dto.TeamResponse;
import com.querydsl.core.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeamCustomRepository {
    Page<TeamResponse> findAllTeams(String name, String managerName, Pageable pageable);

    List<TeamEmployeesResponse> findEmployeesOfTeam(Long id);
}
