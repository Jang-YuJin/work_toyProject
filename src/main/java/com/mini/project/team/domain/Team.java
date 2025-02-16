package com.mini.project.team.domain;

import com.mini.project.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = null;
    private String name;
    @OneToMany(mappedBy = "team", orphanRemoval = true)
    private List<Employee> employeeList = new ArrayList<>();
    private LocalDateTime regDate;
    private LocalDateTime delDate;
    private LocalDateTime updateDate;
    private boolean delYn;
    private Long dayOffReady;
}
