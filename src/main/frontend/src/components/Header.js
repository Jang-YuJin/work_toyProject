import React from "react";
import {Link} from "react-router-dom";
import "../css/Header.css"

function Header() {
    return (
        <header>
            <div className={"img_logo"}>
                <Link to={"/"}>
                    <img src={process.env.PUBLIC_URL + '/logo.png'}/>
                </Link>
            </div>
            <ul className={"nav"}>
                <li>
                    <Link to={"/"}>메인</Link>
                </li>
                <li>
                    <Link to={"/TeamList"}>팀 조회</Link>
                </li>
                <li>
                    <Link to={"/EmpList"}>직원 조회</Link>
                </li>
                <li>
                    <Link to={"/OverWork"}>초과근무</Link>
                </li>
            </ul>
        </header>
    );
}

export default Header;