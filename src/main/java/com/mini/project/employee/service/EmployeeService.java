package com.mini.project.employee.service;

import com.mini.project.employee.domain.Employee;
import com.mini.project.employee.dto.EmployeeCreateRequest;
import com.mini.project.employee.dto.EmployeeResponse;
import com.mini.project.employee.repository.EmployeeRepository;
import com.mini.project.team.domain.Team;
import com.mini.project.team.repository.TeamRepository;
import com.mini.project.work.domain.Work;
import com.mini.project.work.repository.WorkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository repository;
    private final TeamRepository teamRepository;
    private final WorkRepository workRepository;

    @Transactional
    public Page<EmployeeResponse> getEmployees(String name, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return repository.findAllEmployees(name, startDate, endDate, pageable);
    }

    @Transactional
    public void addEmployee(EmployeeCreateRequest request) {
        //해당 팀에 매니저가 있는지 여부
        if(request.isManager()){
            boolean existManager = repository.existManager(request.getTeamId());
            if(existManager){
                throw new RuntimeException("Manager already exists");
            }
        }

        int dayOffCnt = 11;
        if(request.getHireDate().isBefore(LocalDate.of(LocalDate.now().getYear(), 1,1))){
            dayOffCnt = 15;
        }
        Optional<Team> team = teamRepository.findById(request.getTeamId());
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setManager(request.isManager());
        employee.setHireDate(request.getHireDate());
        employee.setBirthday(request.getBirthday());
        employee.setDayOffCnt(dayOffCnt);
        employee.setTeam(team.get());
        employee.setRegDate(LocalDateTime.now());
        employee.setDelYn(false);
        repository.save(employee);
    }

    @Transactional
    public void startWorkEmployee(Map<String, Long> param) {
        //work 테이블에서 오늘날짜로 employeeId가 있으면 err
        boolean isGoWork = repository.selectTodayGoWork(param.get("employeeId"));

        if(isGoWork){
            throw new RuntimeException("해당 직원은 이미 출근을 완료했습니다.");
        } else {//아니라면 work테이블에 insert
            Employee employeeRef = repository.getReferenceById(param.get("employeeId"));

            Work work = new Work();
            work.setEmployee(employeeRef);
            work.setStartWorkTime(LocalDateTime.now());
            work.setWorkDay(Date.valueOf(LocalDate.now()));
            work.setDayOff(false);
            work.setRegDate(LocalDateTime.now());
            work.setWorkDay(Date.valueOf(LocalDate.now()));

            workRepository.save(work);
        }
    }

    @Transactional
    public void endWorkEmployee(Map<String, Long> param) {
        //work 테이블에서 오늘날짜로 employeeId가 있고 출근 날짜가 있어야 퇴근 처리 할 수 있음
        boolean isGoWork = repository.selectTodayGoWork(param.get("employeeId"));
        if(isGoWork) {
            List<Work> works = workRepository.findByEmployeeIdToWork(param.get("employeeId"));

            if(works.size() > 1){
                throw new RuntimeException("해당 직원의 출근/연차 정보 오류로 퇴근 처리를 할 수 없습니다.");
            } else {
                Work work = works.get(0);
                work.setEndWorkTime(LocalDateTime.now());
            }
        } else{
            throw new RuntimeException("해당 직원은 퇴근 처리를 할 수 없습니다.");
        }
    }

    @Transactional
    public Optional<Employee> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public void updateEmployee(EmployeeCreateRequest employee, Long id) {
        try {
            //id로 직원 조회
            Optional<Employee> orgEmployeeOptional = repository.findById(id);
            Employee orgEmployee = orgEmployeeOptional.get();

            //해당 직원 팀에 매니저 있는지 여부
            if(employee.isManager()){
                boolean existManager = repository.existManager(orgEmployee.getTeam().getId());
                if(existManager){
                    throw new RuntimeException("Manager already exists");
                }
            }

            orgEmployee.setName(employee.getName());
            orgEmployee.setManager(employee.isManager());
            orgEmployee.setHireDate(employee.getHireDate());
            orgEmployee.setBirthday(employee.getBirthday());
            orgEmployee.setTeam(teamRepository.getReferenceById(employee.getTeamId()));
            orgEmployee.setUpdateDate(LocalDateTime.now());
        } catch (Exception e) {
            throw new RuntimeException(e);
          }
    }

    @Transactional
    public void deleteById(Long id) {
        Employee employee = repository.getReferenceById(id);
        employee.setDelYn(true);
        employee.setDelDate(LocalDateTime.now());
    }

    @Transactional
    public Long findEmployeeDayOffReady(Long id) {
        return repository.findEmployeeDayOffReady(id);
    }

    @Transactional
    public void insertDayOff(Long id, Map<String, Object> dayOff) {
        try {
            //id로 dayOffCnt 조회해서 > 0 확인
            Employee employee = repository.getReferenceById(id);

            if(employee.getDayOffCnt() > 0){
                //같은 날 연차를 신청한 경우 err
                List<Date> dayOffList = repository.findDayOffList(id);
                for(Date date : dayOffList){
                    if(date.toLocalDate().equals(java.sql.Date.valueOf(dayOff.get("dayOff").toString()).toLocalDate())){
                        throw new RuntimeException("같은 날짜에 연차를 신청했습니다.");
                    }
                }

                //work테이블에 dayOff insert
                Work work = new Work();
                work.setEmployee(repository.getReferenceById(id));
                work.setWorkDay(java.sql.Date.valueOf(dayOff.get("dayOff").toString()));
                work.setDayOff(true);
                work.setRegDate(LocalDateTime.now());

                workRepository.save(work);

                //dayOffCnt -1 update
                int dayOffCnt = employee.getDayOffCnt() - 1;
                employee.setDayOffCnt(dayOffCnt);
            } else {
                throw new RuntimeException("해당 직원의 연차 횟수는 0개 입니다.");
            }
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public List<Date> findDayOffList(Long id) {
        return repository.findDayOffList(id);
    }

    @Transactional
    public void resetDayOffCnt() {
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);

        List<Employee> employees = repository.findByHireDateAndDelYn(oneYearAgo, false);

        for(Employee employee : employees){
            employee.setDayOffCnt(15);
        }
    }
}
