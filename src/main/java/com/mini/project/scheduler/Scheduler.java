package com.mini.project.scheduler;

import com.mini.project.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Scheduler {
    private final EmployeeService employeeService;
    private static final Logger logger = LoggerFactory.getLogger(Scheduler.class);

    @Scheduled(cron = "0 0 0 * * *")
    public void resetDayOffCnt(){
        employeeService.resetDayOffCnt();
        logger.info("연차 갱신(또는 초기화) 스케줄러가 실행");
    }
}
