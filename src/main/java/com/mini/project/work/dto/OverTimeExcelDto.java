package com.mini.project.work.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OverTimeExcelDto {
    private String employeeName;
    private String teamName;
    private long overTimeMin;
    private long workMin;
}
