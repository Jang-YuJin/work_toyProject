package com.mini.project.work.repository;

import com.mini.project.work.domain.Work;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import static com.mini.project.work.domain.QWork.work;
import static com.querydsl.core.types.dsl.Expressions.constant;
import static com.querydsl.core.types.dsl.Expressions.stringTemplate;

@Repository
@RequiredArgsConstructor
public class WorkCustomRepositoryImpl implements WorkCustomRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Work> findByEmployeeIdToWork(Long employeeId) {
        List<Work> works = queryFactory.selectFrom(work)
                .where(work.employee.id.eq(employeeId),
                        work.workDay.isNotNull(),
                        work.workDay.eq(Date.valueOf(LocalDate.now())),
                        work.startWorkTime.isNotNull(),
                        stringTemplate("DATE_FORMAT({0}, {1})", work.startWorkTime, constant("%Y-%m-%d")).eq(Date.valueOf(LocalDate.now()).toString()),
                        work.endWorkTime.isNull(),
                        work.isDayOff.eq(false)
                        )
                .fetch();
        return works;
    }

    @Override
    public List<Work> findWorkByEmployeeIds(List<Long> empIds, LocalDate startDate, LocalDate endDate) {
        return  queryFactory
                .selectFrom(work)
                .where(work.employee.id.in(empIds)
                    , work.workDay.isNotNull()
                    , work.workDay.between(Date.valueOf(startDate), Date.valueOf(endDate))
                    , work.isDayOff.eq(false))
                .fetch();
    }
}
