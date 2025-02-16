package com.mini.project.employee.repository;

import com.mini.project.employee.dto.EmployeeResponse;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static com.mini.project.employee.domain.QEmployee.employee;
import static com.mini.project.team.domain.QTeam.team;
import static com.mini.project.work.domain.QWork.work;
import static com.querydsl.core.types.dsl.Expressions.constant;
import static com.querydsl.core.types.dsl.Expressions.stringTemplate;

@Repository
@RequiredArgsConstructor
public class EmployeeCustomRepositoryImpl implements EmployeeCustomRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<EmployeeResponse> findAllEmployees(String name, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        List<EmployeeResponse> employees = queryFactory.
                select(Projections.constructor(
                          EmployeeResponse.class
                        , employee.id
                        , employee.name
                        , employee.hireDate
                        , employee.birthday
                        , new CaseBuilder()
                                .when(employee.isManager.eq(true)).then("MANAGER")
                                .otherwise("MEMBER").as("role")
                        , employee.dayOffCnt
                        , ExpressionUtils.as(employee.team.id, "teamId")
                        , ExpressionUtils.as(JPAExpressions.select(team.name)
                                        .from(team)
                                        .where(team.id.eq(employee.team.id)), "teamName")
                        , ExpressionUtils.as(employee.hireDate, "workStartDate")
                        , ExpressionUtils.as(JPAExpressions.select(work.workDay)
                                .from(work)
                                .where(work.employee.id.eq(employee.id),
                                        work.workDay.eq(Date.valueOf(LocalDate.now()))), "workDay")
                        , ExpressionUtils.as(JPAExpressions.select(work.startWorkTime)
                                        .from(work)
                                        .where(work.employee.id.eq(employee.id),
                                                work.workDay.eq(Date.valueOf(LocalDate.now()))), "startWorkTime")
                        , ExpressionUtils.as(JPAExpressions.select(work.endWorkTime)
                                        .from(work)
                                        .where(work.employee.id.eq(employee.id),
                                                work.workDay.eq(Date.valueOf(LocalDate.now()))), "endWorkTime")
                        ,ExpressionUtils.as(JPAExpressions.select(work.isDayOff)
                                        .from(work)
                                        .where(work.employee.id.eq(employee.id),
                                                work.workDay.eq(Date.valueOf(LocalDate.now()))), "isDayOff")
                    )
                )
                .from(employee)
                .where(
                        name != null ? employee.name.contains(name) : null,
                        startDate != null ? employee.hireDate.goe(startDate) : null,
                        endDate != null ? employee.hireDate.loe(endDate) : null,
                        employee.delYn.eq(false)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(employee.count())
                .from(employee)
                .where(
                        name != null ? employee.name.contains(name) : null,
                        startDate != null ? employee.hireDate.goe(startDate) : null,
                        endDate != null ? employee.hireDate.loe(endDate) : null,
                        employee.delYn.eq(false)
                );

        return PageableExecutionUtils.getPage(employees, pageable, countQuery::fetchOne);
    }

    @Override
    public boolean selectTodayGoWork(Long employeeId) {

        return queryFactory.
                select(work.startWorkTime)
                .from(work)
                .where(
                        work.employee.id.eq(employeeId),
                        work.workDay.isNotNull(),
                        work.workDay.eq(Date.valueOf(LocalDate.now())),
                        work.startWorkTime.isNotNull(),
                        stringTemplate("DATE_FORMAT({0}, {1})", work.startWorkTime, constant("%Y-%m-%d")).eq(Date.valueOf(LocalDate.now()).toString()),
                        work.endWorkTime.isNull()
                )
                .fetchFirst() != null;
    }

    @Override
    public Long findEmployeeDayOffReady(Long id) {
        return queryFactory
                .select(team.dayOffReady)
                .from(team)
                .join(team.employeeList, employee)
                .where(employee.id.eq(id))
                .fetchOne();
    }

    @Override
    public List<Date> findDayOffList(Long id) {
        return queryFactory
                .select(work.workDay)
                .from(employee)
                .join(employee.workList, work)
                .where(work.isDayOff.eq(true),
                        work.workDay.goe(Date.valueOf(LocalDate.now())),
                        work.employee.id.eq(id))
                .fetch();
    }

    @Override
    public boolean existManager(long teamId) {
        return queryFactory
                .select(employee.id)
                .from(team)
                .join(team.employeeList, employee)
                .where(employee.isManager.eq(true),
                        team.id.eq(teamId))
                .fetchFirst() != null;
    }
}