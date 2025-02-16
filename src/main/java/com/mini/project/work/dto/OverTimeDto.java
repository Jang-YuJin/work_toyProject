package com.mini.project.work.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OverTimeDto {
    private Long employeeId;
    private String employeeName;
    private long overTimeMin;
    private long workMin;
    private String teamName;
}
