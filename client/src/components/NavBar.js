import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Navbar} from "react-bootstrap";
import {Container, Nav} from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom";
import {
    HOME_ROUTE,
    SIGN_IN_ROUTE,
    THEMES_ROUTE,
    USERS_ROUTE
} from "../utils/constsPath";
import {action} from "mobx";
import Logo from "./otherComponents/logo";
import {check, exit} from "../httpRequests/authAPI";
import UserImgLink from "./basicElements/userImgLink";

const NavBar = (() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [requestCompleted, setRequestCompleted] = useState(false)
    useEffect(() => {


    }, [user.isAuth])
    const logOut = action(() => {
        exit(user);

        navigate(SIGN_IN_ROUTE());
    });
    useEffect(() => {
        check(user).then((result) => {
            setRequestCompleted(result)
        });
    })

    useEffect(() => {
    }, [requestCompleted])
    if (!requestCompleted) return <></>

    return (
        <Navbar collapseOnSelect expand="lg" style={{
            position: "fixed",
            width: "100%",
            height: 50,
            top: 0,
            zIndex: 99,
            background: "rgba(255,255,255,0.70)",
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}>
            <Container>
                <NavLink to={HOME_ROUTE()} style={{color: 'white', textDecoration: "none"}}>
                    <Logo fontSize={20}/>
                </NavLink>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                    </Nav>
                    <Nav style={{
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: 'blur(10px)',
                        height: '100%'
                    }}>
                        {
                            user.isAuth
                                ?
                                (
                                    <Nav className="me-auto" style={{alignItems: "center"}}>


                                        <Nav.Link
                                            onClick={() => {
                                                navigate(USERS_ROUTE())
                                            }}
                                        >
                                            Пользователи
                                        </Nav.Link>

                                        <Nav.Link
                                            onClick={() => {
                                                navigate(THEMES_ROUTE())
                                            }}
                                        >
                                            Темы
                                        </Nav.Link>
                                        <Nav.Link
                                            onClick={() => {
                                                navigate(HOME_ROUTE())
                                            }}
                                        >
                                            Общий рейтинг
                                        </Nav.Link>

                                        <Nav.Link
                                            onClick={() => logOut()}
                                        >Выйти</Nav.Link>
                                        <UserImgLink _id={user.user._id} nickname={user.user.nickname}
                                                     role={user.user.role}/>

                                    </Nav>
                                )
                                :
                                (
                                    <Nav className="me-auto">
                                        <Nav.Link
                                            onClick={() => navigate(SIGN_IN_ROUTE())}
                                        >Авторизация</Nav.Link>
                                    </Nav>
                                )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
});

export default NavBar;