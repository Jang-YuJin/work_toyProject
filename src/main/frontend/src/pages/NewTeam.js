import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

import '../css/input.css'
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import {styled} from '@mui/material/styles';
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {tableCellClasses} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0d80d8',
        color: theme.palette.common.white,
    }
}));

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

function Rows({ list = [] }) {
    if (!list.length) {
        return (
            <TableRow hover>
                <TableCell colSpan={2} align="center">조회된 매니저, 팀원이 없습니다.</TableCell>
            </TableRow>
        );
    }

    return list.map((off) => (
        <TableRow hover key={list}>
            <TableCell align="center">{off.name}</TableCell>
            <TableCell align="center">{off.isManager}</TableCell>
        </TableRow>
    ));
}

function NewTeam(){
    const {id} = useParams();
    const [teamList, setTeamList] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        dayOffReady: 0,
    });

    // (공통) 텍스트 인풋/데이트 인풋 등 onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        //id가 존재하면 수정
        if(id){
            axios.get(process.env.REACT_APP_DB_HOST + `/team/${id}`)
                .then(res => {
                    setFormData(res.data.team);
                    setTeamList(res.data.list);
                })
                .catch(err => {
                    console.error(err);
                    alert("팀 정보를 가져오는 중 오류가 발생했습니다.");
                });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(id){//수정 저장
            axios.put(process.env.REACT_APP_DB_HOST + `/team/${id}`, formData)
                .then(() => {
                    alert('팀 정보가 수정 되었습니다.');
                    navigate("/teamList");
                })
                .catch(err => {
                    console.error(err);
                    alert('팀 정보 수정 중 오류가 발생했습니다.');
                });
        } else {//등록 저장
            axios.post(process.env.REACT_APP_DB_HOST + '/team', formData)
                .then(() => {
                    alert('팀 정보가 등록 되었습니다.');
                    navigate('/teamList');
                })
                .catch(err => {
                    console.error(err);
                    alert('팀 정보 등록 중 오류가 발생했습니다.');
                });
        }
    };

    // 삭제
    const handleDelete = () => {
        if (!id) return; // 안전장치
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        axios.delete(process.env.REACT_APP_DB_HOST + `/team/${id}`)
            .then(() => {
                alert('팀 정보가 삭제 되었습니다.');
                navigate('/teamList');
            })
            .catch(err => {
                console.error(err);
                alert('팀 정보 삭제 중 오류가 발생했습니다.');
            });
    };

    const goList = () => {
        navigate('/teamList');
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? '팀 정보 수정' : '팀 정보 등록'}</h2>
            <Grid container spacing={3}>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="팀이름" required>
                        팀이름
                    </FormLabel>
                    <OutlinedInput
                        id="name"
                        name="name"
                        type="name"
                        placeholder="영업부"
                        autoComplete="name"
                        required
                        size="small"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value })}
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="birthday" required>
                        연차 기간
                    </FormLabel>
                    <OutlinedInput
                        id="dayOffReady"
                        name="dayOffReady"
                        type="number"
                        inputProps={{max:30, min: 0}}
                        autoComplete="dayOffReady"
                        required
                        size="small"
                        value={formData.dayOffReady}
                        onChange={(e) => setFormData({...formData, dayOffReady: e.target.value })}
                    />
                </FormGrid>
            </Grid>
            <TableContainer component={Paper} sx={{borderRadius: 3, marginTop: '30px'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>이름</StyledTableCell>
                            <StyledTableCell align={"center"} sx={{ fontWeight: 'bold' }}>직위</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Rows list={teamList} />
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={'saveBtn'}>
                <Button variant="contained" type={"submit"}>저장</Button>
                {id && (
                    <div className={'delBtn'}><Button variant="contained" color="error" onClick={handleDelete}>삭제</Button></div>
                )}
                <div className={'delBtn'}><Button variant="outlined" onClick={goList}>목록</Button></div>
            </div>
        </form>
    )
}

export default NewTeam;