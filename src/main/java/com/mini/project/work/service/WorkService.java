package com.mini.project.work.service;

import com.mini.project.employee.domain.Employee;
import com.mini.project.employee.repository.EmployeeRepository;
import com.mini.project.work.domain.Work;
import com.mini.project.work.dto.OverTimeDto;
import com.mini.project.work.dto.OverTimeExcelDto;
import com.mini.project.work.repository.WorkRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.rmi.RemoteException;
import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkService {
    private final WorkRepository repository;
    private final EmployeeRepository employeeRepository;
    private final RestTemplate restTemplate;

    @Transactional
    public Page<OverTimeDto> findOverWork(String year, String month, Pageable pageable) throws IOException {
        JSONObject items = new HolidayConnect(restTemplate).connect(year, month);
        List<LocalDate> holidays = new ArrayList<>();

        JSONArray item = new JSONArray();
        if(items != null){
            if(items.get("item").getClass().getName().toString().equals("org.json.JSONObject")){
                item.put(0, items.getJSONObject("item"));
            } else {
                item = items.getJSONArray("item");
            }

            for(int i = 0; i < item.length(); i++){
                holidays.add(LocalDate.parse(item.getJSONObject(i).get("locdate").toString(), DateTimeFormatter.BASIC_ISO_DATE));
            }
        }

        YearMonth yearMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        Page<Employee> pageOfEmployees  = employeeRepository.findAllByDelYnAndHireDateLessThanEqualOrderByNameAsc(false, endDate, pageable);

        if(pageOfEmployees .isEmpty()) {
            return Page.empty(pageable);
        }

        List<Employee> employeesInPage = pageOfEmployees.getContent();
        List<Long> empIds = employeesInPage.stream()
                .map(Employee::getId)
                .collect(Collectors.toList());

        List<Work> works = repository.findWorkByEmployeeIds(empIds, startDate, endDate);

        Map<Long, Long> empOvertimeMap = new HashMap<>();
        Map<Long, Long> empWorktimeMap = new HashMap<>();
        for(Work work : works){
            LocalDate day = LocalDate.parse(work.getWorkDay().toString());
            DayOfWeek dayOfWeek = day.getDayOfWeek();

            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) continue;
            if (holidays.contains(day)) continue;

            long workMin = 0;

            if(work.getEndWorkTime() == null){
                workMin = 480;
            } else{
                workMin = ChronoUnit.MINUTES.between(LocalDateTime.parse(work.getStartWorkTime().toString()), LocalDateTime.parse(work.getEndWorkTime().toString()));
            }
            empWorktimeMap.merge(work.getEmployee().getId(), workMin, Long::sum);
            long overtime = Math.max(workMin - 480, 0);
            empOvertimeMap.merge(work.getEmployee().getId(), overtime, Long::sum);
        }

        List<OverTimeDto> dtoList = employeesInPage.stream()
                .map(emp -> {
                    long overtimeMin = empOvertimeMap.getOrDefault(emp.getId(), 0L);
                    long workMin = empWorktimeMap.getOrDefault(emp.getId(), 0L);
                    return new OverTimeDto(emp.getId(), emp.getName(), overtimeMin, workMin, emp.getTeam().getName());
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, pageOfEmployees.getTotalElements());
    }

    @Transactional
    public List<OverTimeExcelDto> findOverWorkExcel(String year, String month) throws IOException {
        JSONObject items = new HolidayConnect(restTemplate).connect(year, month);
        List<LocalDate> holidays = new ArrayList<>();

        JSONArray item = new JSONArray();
        if(items != null){
            if(items.get("item").getClass().getName().toString().equals("org.json.JSONObject")){
                item.put(0, items.getJSONObject("item"));
            } else {
                item = items.getJSONArray("item");
            }

            for(int i = 0; i < item.length(); i++){
                holidays.add(LocalDate.parse(item.getJSONObject(i).get("locdate").toString(), DateTimeFormatter.BASIC_ISO_DATE));
            }
        }

        YearMonth yearMonth = YearMonth.of(Integer.parseInt(year), Integer.parseInt(month));
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Employee> employees  = employeeRepository.findAllByDelYnAndHireDateLessThanEqualOrderByNameAsc(false, endDate);
        if(employees.isEmpty()){
            throw new RemoteException("초과근무 엑셀 다운로드 할 내용이 없음.");
        }

        List<Long> empIds = employees.stream()
                .map(Employee::getId)
                .collect(Collectors.toList());

        List<Work> works = repository.findWorkByEmployeeIds(empIds, startDate, endDate);

        Map<Long, Long> empOvertimeMap = new HashMap<>();
        Map<Long, Long> empWorktimeMap = new HashMap<>();
        for(Work work : works){
            LocalDate day = LocalDate.parse(work.getWorkDay().toString());
            DayOfWeek dayOfWeek = day.getDayOfWeek();

            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) continue;
            if (holidays.contains(day)) continue;

            long workMin = 0;

            if(work.getEndWorkTime() == null){
                workMin = 480;
            } else{
                workMin = ChronoUnit.MINUTES.between(LocalDateTime.parse(work.getStartWorkTime().toString()), LocalDateTime.parse(work.getEndWorkTime().toString()));
            }
            empWorktimeMap.merge(work.getEmployee().getId(), workMin, Long::sum);
            long overtime = Math.max(workMin - 480, 0);
            empOvertimeMap.merge(work.getEmployee().getId(), overtime, Long::sum);
        }

        return employees.stream()
                .map(emp -> {
                    long overtimeMin = empOvertimeMap.getOrDefault(emp.getId(), 0L);
                    long workMin = empWorktimeMap.getOrDefault(emp.getId(), 0L);
                    return new OverTimeExcelDto(emp.getName(), emp.getTeam().getName(), overtimeMin, workMin);
                })
                .collect(Collectors.toList());
    }
}
