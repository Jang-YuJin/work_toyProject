import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import '../css/input.css'

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

function NewEmp(){
    const {id} = useParams();
    const [teamList, setTeamList] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        isManager: false,
        hireDate: '',
        birthday: '',
        teamId: '',
    });

    //팀 select 조회
    useEffect(() => {
        axios.get(process.env.REACT_APP_DB_HOST + `/teams`)
            .then(res => {
                setTeamList(res.data);
            })
            .catch(err => {
                console.error(err);
                alert("팀 목록을 가져오는 중 오류가 발생했습니다.");
            });
    }, []);

    // (공통) 텍스트 인풋/데이트 인풋 등 onChange 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;  // 예: name="birthday", value="1990-01-01"
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 팀 SELECT용 onChange
    const handleSelectChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            teamId: e.target.value
        }));
    };

    // 매니저 체크박스 onChange
    const handleCheckboxChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            isManager: e.target.checked
        }));
    };

    useEffect(() => {
        //id가 존재하면 수정
        if(id){
            axios.get(process.env.REACT_APP_DB_HOST + `/member/${id}`)
                .then(res => {
                    setFormData(res.data);
                    console.log(res.data);
                })
                .catch(err => {
                    console.error(err);
                    alert("직원 정보를 가져오는 중 오류가 발생했습니다.");
                });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(id){//수정 저장
            axios.put(process.env.REACT_APP_DB_HOST + `/member/${id}`, formData)
                .then(() => {
                    alert('직원 정보가 수정 되었습니다.');
                    navigate("/empList");
                })
                .catch(err => {
                    console.error(err);
                    alert('직원 정보 수정 중 오류가 발생했습니다.');
                });
        } else {//등록 저장
            axios.post(process.env.REACT_APP_DB_HOST + '/member', formData)
                .then(() => {
                    alert('직원 정보가 등록 되었습니다.');
                    navigate('/empList');
                })
                .catch(err => {
                    console.error(err);
                    alert('직원 정보 등록 중 오류가 발생했습니다.');
                });
        }
    };

    // 삭제
    const handleDelete = () => {
        if (!id) return; // 안전장치
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        axios.delete(process.env.REACT_APP_DB_HOST + `/member/${id}`)
            .then(() => {
                alert('직원 정보가 삭제 되었습니다.');
                navigate('/empList');
            })
            .catch(err => {
                console.error(err);
                alert('직원 정보 삭제 중 오류가 발생했습니다.');
            });
    };

    const goList = () => {
        navigate('/empList');
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? '직원 정보 수정' : '직원 정보 등록'}</h2>
            <Grid container spacing={3}>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="이름" required>
                        이름
                    </FormLabel>
                    <OutlinedInput
                        id="name"
                        name="name"
                        type="name"
                        placeholder="홍길동"
                        autoComplete="name"
                        required
                        size="small"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value })}
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="birthday" required>
                        생년월일
                    </FormLabel>
                    <OutlinedInput
                        id="birthday"
                        name="birthday"
                        type="date"
                        autoComplete="birthday"
                        required
                        size="small"
                        value={formData.birthday}
                        onChange={(e) => setFormData({...formData, birthday: e.target.value })}
                    />
                </FormGrid>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="hireDate" required>
                        입사일
                    </FormLabel>
                    <OutlinedInput
                        id="hireDate"
                        name="hireDate"
                        type="date"
                        autoComplete="hireDate"
                        required
                        size="small"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({...formData, hireDate: e.target.value })}
                    />
                </FormGrid>
                <div></div>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="team" required>
                        팀
                    </FormLabel>
                    <Select
                        id={'team'}
                        value={formData.teamId || ''}
                        label={'팀'}
                        onChange={(e) => setFormData({...formData, teamId: e.target.value})}
                        size='small'
                        variant="outlined"
                        >
                        <MenuItem value="">팀을 선택하세요</MenuItem>
                        {teamList.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormGrid>
                <FormGrid size={{ xs: 6 }}>
                    <FormLabel htmlFor="manager">
                        매니저 여부
                    </FormLabel>
                    <div>
                        <FormControlLabel control={<Checkbox />} checked={formData.isManager} onChange={(e) => setFormData({...formData, isManager: e.target.checked})} label="매니저" />
                    </div>
                </FormGrid>
            </Grid>
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

export default NewEmp;