package com.mini.project.employee.controller;

import com.mini.project.employee.dto.EmployeeCreateRequest;
import com.mini.project.employee.dto.EmployeeResponse;
import com.mini.project.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService service;

    @GetMapping("/member")
    public Page<EmployeeResponse> getEmployees(@RequestParam(required = false)String name, @RequestParam(required = false)LocalDate startDate, @RequestParam(required = false)LocalDate endDate, @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return service.getEmployees(name, startDate, endDate, pageable);
    }

    @PostMapping("/member")
    public void addEmployee(@RequestBody EmployeeCreateRequest request) {
        service.addEmployee(request);
    }

    @PostMapping("/member/startWork")
    public void startWorkEmployee(@RequestBody Map<String, Long> param) {
        service.startWorkEmployee(param);
    }

    @PostMapping("/member/endWork")
    public void endWorkEmployee(@RequestBody Map<String, Long> param) {
        service.endWorkEmployee(param);
    }

    @GetMapping("/member/{id}")
    public Optional<EmployeeCreateRequest> getEmployee(@PathVariable Long id) {
        EmployeeCreateRequest detail= new EmployeeCreateRequest(service.findById(id));
        return Optional.of(detail);
    }

    @PutMapping("/member/{id}")
    public void updateEmployee(@RequestBody EmployeeCreateRequest employee, @PathVariable Long id) {
        service.updateEmployee(employee, id);
    }

    @DeleteMapping("/member/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        service.deleteById(id);
    }

    @GetMapping("/member/{id}/dayOffReady")
    public Map<String, Object> findEmployeeDayOffReady(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        Long dayOff = service.findEmployeeDayOffReady(id);
        result.put("dayOff", dayOff);

        List<Date> dayOffList = service.findDayOffList(id);
        result.put("dayOffList", dayOffList);

        return result;
    }

    @PostMapping("/member/{id}/dayOff")
    public void insertDayOff(@PathVariable Long id, @RequestBody Map<String, Object> dayOff) {
        service.insertDayOff(id, dayOff);
    }
}
