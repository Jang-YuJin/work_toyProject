package com.mini.project.employee.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mini.project.employee.domain.Employee;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Optional;

@Setter
@Getter
public class EmployeeCreateRequest {
    private String name;
    @JsonProperty("isManager")
    private boolean isManager;
    private LocalDate hireDate;
    private LocalDate birthday;
    private long teamId;

    public EmployeeCreateRequest(String name, boolean isManager, LocalDate hireDate, LocalDate birthday, long teamId) {
        this.name = name;
        this.isManager = isManager;
        this.hireDate = hireDate;
        this.birthday = birthday;
        this.teamId = teamId;
    }

    public EmployeeCreateRequest() {
    }

    public EmployeeCreateRequest(Optional<Employee> employee) {
        this.name = employee.get().getName();
        this.isManager = employee.get().isManager();
        this.hireDate = employee.get().getHireDate();
        this.birthday = employee.get().getBirthday();
        this.teamId = employee.get().getTeam().getId();
    }
}
