package com.mini.project.work.repository;

import com.mini.project.work.domain.Work;

import java.time.LocalDate;
import java.util.List;

public interface WorkCustomRepository {
    List<Work> findByEmployeeIdToWork(Long employeeId);

    List<Work> findWorkByEmployeeIds(List<Long> empIds, LocalDate startDate, LocalDate endDate);
}
