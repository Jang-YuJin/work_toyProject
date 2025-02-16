package com.mini.project.employee.repository;

import com.mini.project.employee.domain.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, EmployeeCustomRepository {

    Page<Employee> findAllByDelYnAndHireDateLessThanEqualOrderByNameAsc(boolean delYn, LocalDate endDate, Pageable pageable);
    List<Employee> findAllByDelYnAndHireDateLessThanEqualOrderByNameAsc(boolean delYn, LocalDate endDate);

    List<Employee> findByHireDateAndDelYn(LocalDate oneYearAgo, boolean b);
}
