package com.mini.project.employee.domain;

import com.mini.project.team.domain.Team;
import com.mini.project.work.domain.Work;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = null;
    private String name;
    private boolean isManager;
    private LocalDate hireDate;
    private LocalDate birthday;
    private int dayOffCnt;
    @ManyToOne
    private Team team;
    @OneToMany(mappedBy = "employee", orphanRemoval = true)
    private List<Work> workList;
    private LocalDateTime regDate;
    private LocalDateTime delDate;
    private boolean delYn;
    private LocalDateTime updateDate;
}
