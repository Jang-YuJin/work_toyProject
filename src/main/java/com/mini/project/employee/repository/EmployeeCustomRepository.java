package com.mini.project.employee.repository;

import com.mini.project.employee.dto.EmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface EmployeeCustomRepository {
    Page<EmployeeResponse> findAllEmployees(String name, LocalDate startDate, LocalDate endDate, Pageable pageable);

    boolean selectTodayGoWork(Long employeeId);

    Long findEmployeeDayOffReady(Long id);

    List<Date> findDayOffList(Long id);

    boolean existManager(long teamId);
}
