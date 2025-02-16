package com.mini.project.team.repository;

import com.mini.project.team.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long>, TeamCustomRepository {
    List<Team> findByDelYn(boolean delYn);
}
