// src/main/frontend/src/App.js

import React from 'react';
import Container from '@mui/material/Container';
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import EmpList from "./pages/EmpList";
import TeamList from "./pages/TeamList";
import NewEmp from "./pages/NewEmp";
import NewTeam from "./pages/NewTeam";
import OverWork from "./pages/OverWork";

import './App.css';

function App() {

  return (
      <div id={'wrap'}>
      <Container fixed>
          <Header />
              <Routes>
                  <Route path={"/"} element={<Home />} />
                  <Route path={"/empList"} element={<EmpList />} />
                  <Route path={"/teamList"} element={<TeamList />} />
                  <Route path={"/newEmp"} element={<NewEmp />} />
                  <Route path={"/newEmp/:id"} element={<NewEmp />} />
                  <Route path={"/newTeam/"} element={<NewTeam />} />
                  <Route path={"/newTeam/:id"} element={<NewTeam />} />
                  <Route path={"/overWork"} element={<OverWork />} />
              </Routes>
      </Container>
      </div>
  );
}

export default App;