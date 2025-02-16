import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import '../css/EmpList.css'
import '../css/input.css'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {Box, tableCellClasses, TextField} from "@mui/material";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Pagination from '../components/Pagination'
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0d80d8',
        color: theme.palette.common.white,
    }
}));

function Search({
                    onSearch,       // 검색 버튼 클릭 시 부모로 전달할 콜백
                    onReset,        // 초기화 버튼 클릭 시 부모로 전달할 콜백
                    defaultName,    // 부모에서 내려주는 기본 이름
                    defaultManager  // 부모에서 내려주는 기본 매니저 이름
                }) {
    // 로컬에서 검색 조건 상태 관리
    const [name, setName] = useState(defaultName);
    const [managerName, setManagerName] = useState(defaultManager);

    // ★ 부모가 내려준 props가 바뀔 때마다 로컬 state 업데이트
    useEffect(() => {
        setName(defaultName);
        setManagerName(defaultManager)
    }, [defaultName, defaultManager]);

    // 폼 submit → 검색
    const handleSubmit = (e) => {
        e.preventDefault();
        // 부모 콜백에 현재 로컬 상태(검색 조건) 전달
        onSearch({
            name: name,
            managerName: managerName
        });
    };

    // 초기화 버튼 → 부모 콜백 호출
    const handleReset = () => {
        onReset();  // 부모에서 검색 조건을 초기값으로 되돌리고 다시 fetch
    };

    return(
        <form onSubmit={handleSubmit}>
            <Box component="section" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', p: 3, border: '1px solid #A5A5A5', mb: '30px', mt: '30px', gap: 3, gridTemplateRows: 'auto', gridTemplateAreas: `"input1 input2 input3 input4""search search search search"`}} borderRadius={3}>
                <Box className={'inputLabel'} sx={{gridArea: 'input1'}}>
                    <div>팀이름</div>
                </Box>
                <Box  sx={{gridArea: 'input2'}}>
                    <TextField name={'name'} label="이름" variant="standard" value={name} onChange={(e) => setName(e.target.value)}/>
                </Box>
                <Box className={'inputLabel'} sx={{gridArea: 'input3'}}>
                    <div>매니저 이름</div>
                </Box>
                <Box  sx={{gridArea: 'input4'}}>
                    <TextField name={'managerName'} label="매니저 이름" variant="standard" value={managerName} onChange={(e) => setManagerName(e.target.value)}/>
                </Box>
                <Box sx={{gridArea: 'search'}} className={'searchBtn'}>
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" type={'submit'}>검색</Button>
                        <Button variant="outlined" type={'button'} onClick={handleReset}>초기화</Button>
                    </Stack>
                </Box>
            </Box>
        </form>
    );
}

function Rows({team, UpdateTeam}) {
    return(
        <TableRow hover={true}>
            <TableCell align={"center"}>{team.name}</TableCell>
            <TableCell align={"center"}>{team.managerName}</TableCell>
            <TableCell align={"center"}>{team.memberCount}</TableCell>
            <TableCell align={"center"}><Button variant={'contained'} size="small" onClick={(e) => {UpdateTeam(team.id)}}>수정</Button></TableCell>
        </TableRow>
    );
}

function TeamList() {
    //검색 조건 상태 (이름, 시작일, 종료일)
    const [searchParams, setSearchParams] = useState({
        name: '',
        managerName: '',
        memberCount: ''
    });

    const [team, setTeam] = useState([]); // 전체 데이터 저장
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(10); // 한 페이지당 항목 수
    const [totalItems, setTotalItems] = useState(0); // 전체 데이터 수

    const fetchData = async (pageNumber = 1, param = searchParams) => {
        try {
            const page = pageNumber - 1; // Spring Boot는 페이지 인덱스가 0부터 시작
            const response = await fetch(`/team?page=${page}&size=${itemsPerPage}&name=${param.name}&managerName=${param.managerName}`);
            const data = await response.json();

            setTeam(data.content); // 현재 페이지의 데이터 저장
            setTotalItems(data.totalElements); // 전체 데이터 수 저장
        } catch (e) {
            console.log('Error : ' + e);
        }
    }

    //검색 버튼 클릭 시 (Search 컴포넌트 -> 부모 콜백)
    const handleSearch = (values) => {
        setSearchParams(values);
        setCurrentPage(1);

        // 새로 들어온 values로 바로 fetch
        fetchData(1, values);
    };

    //초기화 버튼 클릭 시
    const handleReset = () => {
        // 초기값 세팅
        const resetParams = {
            name: '',
            memberCount: '',
            managerName: ''
        };
        setSearchParams(resetParams);
        setCurrentPage(1);

        // 마찬가지로 resetParams로 fetch
        fetchData(1, resetParams);
    };

    //팀 수정
    const navigate = useNavigate();
    const handleUpdateTeam = (teamId) => {
        navigate(`/newTeam/${teamId}`);
    }

    //등록버튼
    const goTo = () => {
        navigate('/newTeam');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 현재 페이지 업데이트
        fetchData(pageNumber); // 새 데이터를 가져오기
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={"content"}>
            <Search onSearch={handleSearch} onReset={handleReset} defaultName={searchParams.name} defaultManager={searchParams.managerName}></Search>
            <div className={'count'}><span>전체: {totalItems}</span><Button variant={'contained'} onClick={(e) => {
                goTo()
            }}>등록</Button></div>
            <TableContainer component={Paper} className={"tb_team_container"} sx={{borderRadius: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>이름</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>매니저</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>팀원 수</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>수정</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {team.map(e => (
                            <Rows team={e} key={e.id}
                                  UpdateTeam={handleUpdateTeam}/>)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination currentPage={currentPage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={totalItems}
                        onPageChange={handlePageChange}/>
        </div>
    );
}

export default TeamList;