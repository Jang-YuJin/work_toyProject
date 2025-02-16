package com.mini.project.employee.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class EmployeeResponse {
    private long id;
    private String name;
    private LocalDate hireDate;
    private LocalDate birthday;
    private String role;
    private int dayOffCnt;
    private Long teamId;
    private String teamName;
    private LocalDate workStartDate;
    private Date workDay;
    private LocalDateTime startWorkTime;
    private LocalDateTime endWorkTime;
    private boolean isDayOff;

    public EmployeeResponse(long id, String name, LocalDate hireDate, LocalDate birthday, String role, int dayOffCnt, Long teamId, String teamName, LocalDate workStartDate, Date workDay, LocalDateTime startWorkTime, LocalDateTime endWorkTime, boolean isDayOff) {
        this.id = id;
        this.name = name;
        this.hireDate = hireDate;
        this.birthday = birthday;
        this.role = role;
        this.dayOffCnt = dayOffCnt;
        this.teamId = teamId;
        this.teamName = teamName;
        this.workStartDate = workStartDate;
        this.workDay = workDay;
        this.startWorkTime = startWorkTime;
        this.endWorkTime = endWorkTime;
        this.isDayOff = isDayOff;
    }
}
