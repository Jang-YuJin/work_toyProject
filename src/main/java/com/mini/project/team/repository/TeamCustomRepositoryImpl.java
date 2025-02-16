package com.mini.project.team.repository;

import com.mini.project.team.dto.TeamEmployeesResponse;
import com.mini.project.team.dto.TeamResponse;
import com.querydsl.core.Tuple;
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

import java.util.List;

import static com.mini.project.employee.domain.QEmployee.employee;
import static com.mini.project.team.domain.QTeam.team;

@Repository
@RequiredArgsConstructor
public class TeamCustomRepositoryImpl implements TeamCustomRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<TeamResponse> findAllTeams(String name, String managerName, Pageable pageable) {
        List<TeamResponse> teams = queryFactory.select(
                        Projections.constructor(
                        TeamResponse.class
                        , team.id
                        , team.name
                        , ExpressionUtils.as(JPAExpressions.select(employee.id.count())
                                        .from(employee)
                                        .where(team.id.eq(employee.team.id), employee.delYn.eq(false)) , "memberCount")
                        , ExpressionUtils.as(JPAExpressions.select(employee.name)
                                .from(employee)
                                .where(team.id.eq(employee.team.id),
                                        employee.isManager.eq(true),
                                        employee.delYn.eq(false)), "managerName")
                        )
                )
                .from(team)
                .leftJoin(team.employeeList, employee)
                .where(name != null && !name.isEmpty() ? team.name.contains(name) : null,
                        managerName != null && !managerName.isEmpty() ? employee.name.contains(managerName).and(employee.isManager.eq(true)) : null,
                        team.delYn.eq(false))
                .groupBy(team.id)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(team.count())
                .from(team)
                .leftJoin(team.employeeList, employee)
                .where(name != null ? team.name.contains(name) : null,
                        managerName != null && !managerName.isEmpty() ? employee.name.contains(managerName).and(employee.isManager.eq(true)) : null,
                        team.delYn.eq(false))
                .groupBy(team.id);

        return PageableExecutionUtils.getPage(teams, pageable, countQuery::fetchOne);
    }

    @Override
    public List<TeamEmployeesResponse> findEmployeesOfTeam(Long id) {//TODO: 이거 dto 만들어야할듯 tuple로 안쓰고
        return queryFactory
                .select(Projections.constructor(
                            TeamEmployeesResponse.class
                            , employee.name
                            , new CaseBuilder()
                                .when(employee.isManager.eq(true)).then("매니저")
                                .otherwise("팀원").as("isManager")
                        )
                )
                .from(team)
                .join(team.employeeList, employee)
                .where(team.id.eq(id)
                        , employee.delYn.eq(false))
                .orderBy(employee.isManager.desc(), employee.name.asc())
                .fetch();
    }
}
