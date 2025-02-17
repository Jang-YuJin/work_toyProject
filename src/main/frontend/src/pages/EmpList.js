import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import '../css/EmpList.css'
import '../css/input.css'
import dayjs from 'dayjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, tableCellClasses, TextField} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

import Pagination from '../components/Pagination'
import axios from "axios";

//날짜 초기 값
const now = new Date();
const formatDate = (obj) => obj.toISOString().slice(0, 10);
const today = formatDate(now);
const oneYearAgoObj = new Date();
oneYearAgoObj.setFullYear(oneYearAgoObj.getFullYear() - 1);
const oneYearAgo = formatDate(oneYearAgoObj);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0d80d8',
        color: theme.palette.common.white,
    }
}));

//검색
function Search({
                    onSearch,       // 검색 버튼 클릭 시 부모로 전달할 콜백
                    onReset,        // 초기화 버튼 클릭 시 부모로 전달할 콜백
                    defaultName,    // 부모에서 내려주는 기본 이름
                    defaultStart,   // 부모에서 내려주는 기본 시작일 (1년 전)
                    defaultEnd      // 부모에서 내려주는 기본 종료일 (오늘)
                }) {
    // 로컬에서 검색 조건 상태 관리
    const [name, setName] = useState(defaultName);
    const [startDate, setStartDate] = useState(dayjs(defaultStart));
    const [endDate, setEndDate] = useState(dayjs(defaultEnd));

    // ★ 부모가 내려준 props가 바뀔 때마다 로컬 state 업데이트
    useEffect(() => {
        setName(defaultName);
        setStartDate(dayjs(defaultStart));
        setEndDate(dayjs(defaultEnd));
    }, [defaultName, defaultStart, defaultEnd]);

    // 폼 submit → 검색
    const handleSubmit = (e) => {
        e.preventDefault();
        // 부모 콜백에 현재 로컬 상태(검색 조건) 전달
        onSearch({
            name: name,
            startDate: startDate.$d == 'Invalid Date' ? '' : startDate.format('YYYY-MM-DD'),
            endDate: endDate.$d == 'Invalid Date' ? '' : endDate.format('YYYY-MM-DD')
        });
    };

    // 초기화 버튼 → 부모 콜백 호출
    const handleReset = () => {
        onReset();  // 부모에서 검색 조건을 초기값으로 되돌리고 다시 fetch
    };

    return(
        <form onSubmit={handleSubmit}>
            <Box component="section" sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', p: 3, border: '1px solid #A5A5A5', mb: '30px', mt: '30px', gap: 3, gridTemplateRows: 'auto', gridTemplateAreas: `"input1 input2 input3 input4 input5 input6""search search search search search search"`}} borderRadius={3}>
                <Box className={'inputLabel'} sx={{gridArea: 'input1'}}>
                    <div>이름</div>
                </Box>
                <Box  sx={{gridArea: 'input2'}}>
                    <TextField name={'name'} label="이름" variant="standard" value={name} onChange={(e) => setName(e.target.value)}/>
                </Box>
                <Box className={'inputLabel'} sx={{gridArea: 'input3'}}>
                    <div>입사 시작일</div>
                </Box>
                <Box  sx={{gridArea: 'input4'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{monthShort: 'M'}}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="입사 시작일" name={'startDate'} format={'YYYY-MM-DD'} value={startDate} onChange={(e) => setStartDate(dayjs(e))} />
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>
                <Box className={'inputLabel'} sx={{gridArea: 'input5'}}>
                    <div>입사 종료일</div>
                </Box>
                <Box  sx={{gridArea: 'input6'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="입사 종료일" name={'endDate'} format={'YYYY-MM-DD'}value={endDate} onChange={(e) => setEndDate(dayjs(e))} />
                        </DemoContainer>
                    </LocalizationProvider>
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

//목록
function Rows({employee, StartWork, EndWork, UpdateEmployee, onOpenDayOff}) {
    let content = null;
    if(employee.workDay === '' || employee.workDay == null){//출근하기
        content = <Button variant={'contained'} size="small" onClick={(e) => {StartWork(employee.id)}}>출근하기</Button>
    } else if(employee.startWorkTime != null && employee.endWorkTime == null){//퇴근하기
        content = <Button variant={'contained'} size="small" color={'error'} onClick={(e) => {EndWork(employee.id)}}>퇴근하기</Button>
    } else if(employee.workDay !== '' && employee.startWorkTime != null && employee.endWorkTime != null){//출퇴근 완료
        content = '근무 완료';
    } else{//연차
        content = '휴가중';
    }
    return(
        <TableRow hover={true}>
            <TableCell align={"center"}>{employee.name}</TableCell>
            <TableCell align={"center"}>{employee.birthday}</TableCell>
            <TableCell align={"center"}>{employee.teamName}</TableCell>
            <TableCell align={"left"}>{employee.role == "MANAGER" ? "매니저" : "팀원"}</TableCell>
            <TableCell align={"center"}>{employee.workStartDate}</TableCell>
            <TableCell align={"center"}>{content}</TableCell>
            <TableCell align={"center"}>{employee.dayOffCnt}</TableCell>
            <TableCell align={"center"}><Button variant={'contained'} size="small" color={'success'} onClick={(e) => {onOpenDayOff(employee.id, employee.name)}}>연차신청</Button></TableCell>
            <TableCell align={"center"}><Button variant={'contained'} size="small" onClick={(e) => {UpdateEmployee(employee.id)}}>수정</Button></TableCell>
        </TableRow>
    );
}

//연차신청
function DayOff({open, onClose, employeeId, employeeName, onApplied}){
    const [minDate, setMinDate] = useState('');
    const [dayOff, setDayOff] = useState('');
    const [dayOffList, setDayOffList] = useState([]);

    useEffect(() => {
       if(open && employeeId){
           axios.get(process.env.REACT_APP_DB_HOST + `/member/${employeeId}/dayOffReady`)
               .then(res => {
                   const dayOffReady = res.data.dayOff != null ? res.data.dayOff : 0;
                   const current = new Date();
                   // current 날짜에 dayOffReady일을 더해 minDate를 계산
                   current.setDate(current.getDate() + dayOffReady);
                   // YYYY-MM-DD 형식으로 변환
                   const min = current.toISOString().split('T')[0];
                   setMinDate(min);

                   setDayOffList(res.data.dayOffList ?? []);
               })
               .catch(err => {
                   console.error(err);
                   alert('서버 오류가 발생했습니다.');
               });
       } else{
           setDayOff('');
           setMinDate('');
       }
    }, [open, employeeId]);

    const handleApply = async () => {
        if(!dayOff){
            alert('연차 날짜를 선택하세요.');
            return ;
        }

        try {
            await axios.post(process.env.REACT_APP_DB_HOST + `/member/${employeeId}/dayOff`, {dayOff: dayOff});
            alert('연차 신청이 완료 되었습니다.');

            onApplied && onApplied();

            onClose();
        }catch (e) {
            console.error(e);
            alert('연차 신청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth={"xs"} fullWidth={true}>
                <DialogTitle>{employeeName} 연차 신청</DialogTitle>
                <DialogContent sx={{ margin: "auto" }}>
                    <TextField
                        type="date"
                        value={dayOff}
                        onChange={(e) => setDayOff(e.target.value)}
                        slotProps={{htmlInput: {min: minDate}}}
                    />
                </DialogContent>
                <TableContainer component={Paper} sx={{borderRadius: 2, width: 0.8, margin: "auto"}}>
                    <Table size={'small'}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>연차 예정일</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <DayOffRows dayOffList={dayOffList} />
                        </TableBody>
                    </Table>
                </TableContainer>
                <DialogActions>
                    <Button onClick={onClose}>취소</Button>
                    <Button variant="contained" onClick={handleApply}>
                        신청
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

function DayOffRows({ dayOffList = [] }) {
    if (!dayOffList.length) {
        return (
            <TableRow hover>
                <TableCell align="center">사용한 연차가 없습니다.</TableCell>
            </TableRow>
        );
    }

    return dayOffList.map((off) => (
        <TableRow hover key={off}>
            <TableCell align="center">{off}</TableCell>
        </TableRow>
    ));
}

function EmpList() {
    //검색 조건 상태 (이름, 시작일, 종료일)
    const [searchParams, setSearchParams] = useState({
        name: '',
        startDate: '',
        endDate: today
    });

    const [employee, setEmployee] = useState([]); // 전체 데이터 저장
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(10); // 한 페이지당 항목 수
    const [totalItems, setTotalItems] = useState(0); // 전체 데이터 수

    // 모달 상태
    const [dayOffOpen, setDayOffOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);

    const fetchData = async (pageNumber = 1, param = searchParams) => {
        try {
            const page = pageNumber - 1; // Spring Boot는 페이지 인덱스가 0부터 시작
            const response = await fetch(process.env.REACT_APP_DB_HOST + `/member?page=${page}&size=${itemsPerPage}&name=${param.name}&startDate=${param.startDate}&endDate=${param.endDate}`);
            const data = await response.json();

            setEmployee(data.content); // 현재 페이지의 데이터 저장
            setTotalItems(data.totalElements); // 전체 데이터 수 저장
        } catch (e) {
            console.log('Error : ' + e);
        }
    }

    //검색 버튼 클릭 시 (Search 컴포넌트 -> 부모 콜백)
    const handleSearch = (values) => {

        //원래는 아래와 같이 코드를 썼는데 이렇게하면 검색 버튼을 2번 눌러야 검색되는 오류가 발생함.
        //이 이유는 setState는 호출 직후 바로 최신 상태값을 갱신되지 않는데 비동기인 fetchData가 먼저 실행되기 때문
        //그래서 fetchData 파라미터에 param을 추가
        // // values: { name, startDate, endDate }
        // setSearchParams(values);
        // // 검색 시 페이지를 1페이지로 돌리고 다시 조회
        // setCurrentPage(1);
        // fetchData(1);

        const start = new Date(values.startDate);
        const end = new Date(values.endDate);

        if(start > end){
            alert('입사 시작일이 입사 종료일보다 뒤에 있습니다. 확인 해주세요.');
            return ;
        }

        //아래와 같은 코드로 변경 하고 handleReset도 변경
        setSearchParams(values);
        setCurrentPage(1);

        // 새로 들어온 values로 바로 fetch
        fetchData(1, values);
    };

    //초기화 버튼 클릭 시
    const handleReset = () => {
        // // 검색 조건을 “빈 값, 1년 전, 오늘” 로 초기화
        // setSearchParams({
        //     name: '',
        //     startDate: oneYearAgo,
        //     endDate: today
        // });
        // // 페이지 다시 1
        // setCurrentPage(1);
        // // API 재조회
        // fetchData(1);

        // 초기값 세팅
        const resetParams = {
            name: '',
            startDate: '',
            endDate: today
        };
        setSearchParams(resetParams);
        setCurrentPage(1);

        // 마찬가지로 resetParams로 fetch
        fetchData(1, resetParams);
    };

    //출근하기
    const handleStartWork = async (employeeId) => {
        try{
            const response = await axios.post(process.env.REACT_APP_DB_HOST + '/member/startWork', {
                employeeId: employeeId
            });
            alert("출근 처리 되었습니다.");

            fetchData(currentPage);
        } catch (error){
            alert(error);
        }
    };

    //퇴근하기
    const handleEndWork = async (employeeId) => {
        try {
            const response = await axios.post(process.env.REACT_APP_DB_HOST + '/member/endWork', {
                employeeId: employeeId
            });
            alert("퇴근 처리 되었습니다.");

            fetchData(currentPage);
        } catch (e) {
            alert(e);
        }
    };

    //직원 수정
    const navigate = useNavigate();
    const handleUpdateEmployee = (employeeId) => {
        navigate(`/newEmp/${employeeId}`);
    }

    //등록버튼
    const goTo = () => {
        navigate('/newEmp');
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 현재 페이지 업데이트
        fetchData(pageNumber); // 새 데이터를 가져오기
    };

    useEffect(() => {
        fetchData();
    }, []);

    //모달 열기
    const handleOpenDayOffModal = (id, name) => {
        setSelectedEmployeeId(id);
        setSelectedEmployeeName(name);
        setDayOffOpen(true);
    }

    // 모달 닫기
    const handleCloseDayOffModal = () => {
        setDayOffOpen(false);
        setSelectedEmployeeId(null);
    };

    // 연차신청 완료 후(목록 재조회)
    const handleDayOffApplied = () => {
        fetchData(currentPage);
    };

    return (
        <div className={"content"}>
            <Search onSearch={handleSearch} onReset={handleReset} defaultName={searchParams.name} defaultStart={searchParams.startDate} defaultEnd={searchParams.endDate}></Search>
            <div className={'count'}><span>전체: {totalItems}</span><Button variant={'contained'} onClick={(e) => {goTo()}}>등록</Button> </div>
            <TableContainer component={Paper} className={"tb_emp_container"} sx={{borderRadius: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>이름</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>생년월일</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>팀 이름</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>매니저 여부</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>입사일</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>출퇴근</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>연차횟수</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>연차신청</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>수정</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employee.map(e => (<Rows employee={e} key={e.id} StartWork={handleStartWork} EndWork={handleEndWork} UpdateEmployee={handleUpdateEmployee} onOpenDayOff={handleOpenDayOffModal} />)
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination currentPage={currentPage}
                        itemsCountPerPage={itemsPerPage}
                        totalItemsCount={totalItems}
                        onPageChange={handlePageChange} />
            <DayOff
                open={dayOffOpen}
                onClose={handleCloseDayOffModal}
                employeeId={selectedEmployeeId}
                employeeName={selectedEmployeeName}
                onApplied={handleDayOffApplied}
                />
        </div>
    );
}

export default EmpList;