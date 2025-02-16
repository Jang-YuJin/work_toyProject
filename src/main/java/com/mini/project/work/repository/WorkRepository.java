package com.mini.project.work.repository;

import com.mini.project.work.domain.Work;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkRepository extends JpaRepository<Work, Long>, WorkCustomRepository {
}
