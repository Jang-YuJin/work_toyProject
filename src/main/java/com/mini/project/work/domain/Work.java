package com.mini.project.work.domain;

import com.mini.project.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Work {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = null;
    private LocalDateTime startWorkTime;
    private LocalDateTime endWorkTime;
    private boolean isDayOff;
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    private LocalDateTime regDate;
    private Date workDay;
}
