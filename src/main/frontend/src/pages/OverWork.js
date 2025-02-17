import React, { useState, useEffect } from "react";
import {Box, Button, IconButton, Typography, Grid, tableCellClasses} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Pagination from "../components/Pagination";
import TableCell from "@mui/material/TableCell";
import {styled} from "@mui/material/styles";
import axios from "axios";

// (필요하다면) 월을 "01", "02" 형태로 만들고 싶으면 사용
// function padMonth(m) {
//   return m < 10 ? `0${m}` : String(m);
// }

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0d80d8',
        color: theme.palette.common.white,
    }
}));

function downloadExcel(selectedYear, selectedMonth) {
    const year = selectedYear.selectedYear;
    const month = selectedMonth.selectedMonth;

    axios({
        url: process.env.REACT_APP_DB_HOST + '/work/exceldownload',
        method: 'GET',
        params: { year, month },
        responseType: 'blob',  // <-- blob 타입으로 받아야 파일 다운로드 가능
    }).then((res) => {
        // 브라우저에서 파일 다운로드
        const file = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        // 혹은 서버에서 Content-Type을 어떻게 보내느냐에 따라 달라질 수 있음

        // 파일 URL 만들기
        const fileURL = window.URL.createObjectURL(file);

        // <a> 태그를 만들어서 클릭(trigger)해 다운로드 수행
        const tempLink = document.createElement("a");
        tempLink.href = fileURL;

        // 사용자에게 저장될 파일명 (원하는 대로)
        tempLink.setAttribute("download", "초과근무_목록.xlsx");

        // 다운로드 실행
        document.body.appendChild(tempLink);
        tempLink.click();

        // cleanup
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(fileURL);
    }).catch((err) => {
        console.error(err);
        alert('서버 오류가 발생했습니다.');
    });
}

function Rows({data}) {

    return(
        <TableRow hover={true}>
            <TableCell align={"center"}>{data.employeeName}</TableCell>
            <TableCell align={"center"}>{data.teamName}</TableCell>
            <TableCell align={"center"}>{data.overTimeMin}</TableCell>
            <TableCell align={"center"}>{data.workMin}</TableCell>
        </TableRow>
    );
}

function OverWork() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState(currentYear);
    // 페이지 로드 시 현재 연/월을 기본으로 쓰고 싶다면 여기서 currentMonth로.
    // 하지만 “이전 연도 버튼을 누르면 월 선택 해제”하려면, 아래 로직 참고.
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [fetchedData, setFetchedData] = useState(null);
    //페이징
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(10); // 한 페이지당 항목 수
    const [totalItems, setTotalItems] = useState(0); // 전체 데이터 수

    // 올해인지 확인
    const isCurrentYear = (selectedYear === currentYear);

    // 달 목록 [1..12]
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // 이전 연도
    const handlePrevYear = () => {
        setSelectedYear((prev) => prev - 1);
        // ▼ 이전 연도로 가면 월 초기화
        setSelectedMonth(null);
        setFetchedData(null);
        setCurrentPage(1);
    };

    // 다음 연도
    const handleNextYear = () => {
        if (selectedYear < currentYear) {
            setSelectedYear((prev) => prev + 1);
            // ▼ 여기서도 월 초기화할지 여부는 취향에 따라
            setSelectedMonth(null);
            setFetchedData(null);
            setCurrentPage(1);
        }
    };

    // 월 클릭
    const handleMonthClick = (month) => {
        setSelectedMonth(month);
        setCurrentPage(1);
    };

    // useEffect로 API 호출
    useEffect(() => {
        // 월이 null이면 아직 선택 안 된 상태 → fetch 안 함
        if (selectedMonth == null) {
            setFetchedData(null);
            return;
        }

        fetchDataFunc(1);
    }, [selectedYear, selectedMonth]);

    const fetchDataFunc = async (pageNumber = 1) => {
        try {
            const page = pageNumber - 1;
            const response = await fetch(process.env.REACT_APP_DB_HOST + `/work?year=${selectedYear}&month=${selectedMonth}&page=${page}&size=${itemsPerPage}`);
            const data = await response.json();
            setFetchedData(data.content);
            setCurrentPage(1);
            setTotalItems(data.totalElements);
        } catch (err) {
            console.error(err);
            setFetchedData(null);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 현재 페이지 업데이트
        fetchDataFunc(pageNumber); // 새 데이터를 가져오기
    };

    return (
        <Box sx={{ textAlign: "center", mt: 3 }}>
            {/* 상단 연도/버튼 영역 */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                <IconButton onClick={handlePrevYear}>
                    <ArrowBackIosNewIcon />
                </IconButton>

                <Typography variant="h5" sx={{ mx: 2, fontWeight: "bold" }}>
                    {selectedYear}년
                </Typography>

                {selectedYear < currentYear && (
                    <IconButton onClick={handleNextYear}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                )}
            </Box>

            {/* 월 버튼들 */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                {months.map((m) => {
                    const disabled = isCurrentYear && m > currentMonth;
                    // 선택 여부에 따라 스타일 변경
                    const isSelected = (selectedMonth === m);

                    return (
                        <Grid item key={m}>
                            <Button
                                sx={{borderRadius: '50%', height: '60px'}}
                                variant={isSelected ? "contained" : "outlined"}
                                color={"primary"}
                                disabled={disabled}
                                onClick={() => handleMonthClick(m)}
                            >
                                {m}월
                            </Button>
                        </Grid>
                    );
                })}
            </Grid>

            {/* 데이터 표시 영역 */}
            <Box sx={{ mt: 3 }}>
                {selectedMonth ? (
                    <>
                        {fetchedData && fetchedData.length > 0 ? (
                            <div>
                                <div className={'count'}><span>전체: {totalItems}</span><Button variant={'contained'} onClick={(e) => {downloadExcel({selectedYear}, {selectedMonth})}}>엑셀다운로드</Button></div>
                                <TableContainer component={Paper} className={"tb_emp_container"} sx={{borderRadius: 3}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align={"center"}
                                                                 sx={{fontWeight: 'bold'}}>이름</StyledTableCell>
                                                <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>팀
                                                    이름</StyledTableCell>
                                                <StyledTableCell align={"center"}
                                                                 sx={{fontWeight: 'bold'}}>초과근무(분)</StyledTableCell>
                                                <StyledTableCell align={"center"}
                                                                 sx={{fontWeight: 'bold'}}>근무시간(분)</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fetchedData.map(d => (
                                                <Rows data={d}/>)
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Pagination currentPage={currentPage}
                                            itemsCountPerPage={itemsPerPage}
                                            totalItemsCount={totalItems}
                                            onPageChange={handlePageChange}/>
                            </div>
                        ) : (
                            <div>
                                <div className={'count'}><span>전체: {totalItems}</span></div>
                                <TableContainer component={Paper} className={"tb_emp_container"} sx={{borderRadius: 3}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>이름</StyledTableCell>
                                                <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>팀 이름</StyledTableCell>
                                                <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>초과근무(분)</StyledTableCell>
                                                <StyledTableCell align={"center"} sx={{fontWeight: 'bold'}}>근무시간(분)</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow hover={true}>
                                                <TableCell align={"center"} colSpan={4}>조회된 데이터가 없습니다.</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        )}
                    </>
                ) : (
                    <Typography>월을 선택해주세요</Typography>
                )}
            </Box>
        </Box>
    );
}

export default OverWork;
