import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Button, Navbar} from "react-bootstrap";
import {Container, Nav} from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom";
import {HOME_ROUTE, SIGN_IN_ROUTE, TASKS_ROUTE, USERS_ROUTE} from "../utils/constsPath";
import {action} from "mobx";
import Logo from "./otherComponents/logo";
import {check, exit} from "../httpRequests/authApi";

const NavBar = (() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [requestCompleted, setRequestCompleted] = useState(false)
    useEffect(() => {


    }, [user.isAuth])
    const logOut = action(() => {
        exit(user);

        navigate(SIGN_IN_ROUTE);
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
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{position: "fixed",
            width: "100%",
            height: 50,
            top: 0,
            zIndex: 99}}>
            <Container>
                <NavLink to={HOME_ROUTE} style={{color: 'white', textDecoration: "none"}}>
                    <Logo fontSize={20}/>
                </NavLink>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                    </Nav>
                    <Nav style={{background:'#212529'}}>
                        {
                            user.isAuth
                                ?
                                (
                                    <Nav className="me-auto">
                                        <div style={{color: 'white', paddingRight: 10, textAlign: "center", alignSelf: "center"}}>
                                            {user.user.nickname} [id{user.user.id}]
                                        </div>

                                        <Nav.Link
                                                onClick={() => {
                                                    navigate(USERS_ROUTE)
                                                }}
                                        >Пользователи</Nav.Link>
                                        <Nav.Link
                                                onClick={() => {
                                                    navigate(TASKS_ROUTE)
                                                }}
                                        >Задачи</Nav.Link>


                                        <Nav.Link
                                                onClick={() => logOut()}
                                        >Выйти</Nav.Link>
                                    </Nav>
                                )
                                :
                                (
                                    <Nav className="me-auto">
                                        <Nav.Link
                                                onClick={() => navigate(SIGN_IN_ROUTE)}
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
/*
     <Navbar
            style={{
                backgroundColor: 'rgb(40,40,40)',
                position: "fixed",
                width: "100%",
                height: 50,
                top: 0,
                zIndex: 99
            }}
            expand="lg"
        >
            <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <NavLink to={HOME_ROUTE} style={{color: 'white', textDecoration: "none"}}>
                    <Logo fontSize={20}/>
                </NavLink>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{background: "white", flexGrow: 0}}/>

                <Navbar.Collapse aria-controls="responsive-navbar-nav" style={{backgroundColor: 'rgb(40,40,40)', flexGrow: 1, marginLeft: "auto"}}>
                    {
                        user.isAuth
                            ?
                            (
                                <Nav className="me-auto">
                                    <div style={{color: 'white', paddingRight: 10, textAlign: "center"}}>
                                        {user.user.nickname} [id{user.user.id}]
                                    </div>

                                    <Button variant={"outline-light"}
                                            onClick={() => {
                                                navigate(USERS_ROUTE)
                                            }}
                                    >Пользователи</Button>
                                    <Button variant={"outline-light"}
                                            onClick={() => {
                                                navigate(TASKS_ROUTE)
                                            }}
                                    >Задачи</Button>


                                    <Button variant={"outline-light"}
                                            onClick={() => logOut()}
                                    >Выйти</Button>
                                </Nav>
                            )
                            :
                            (
                                <Nav className="me-auto">
                                    <Button variant={"outline-light"}
                                            onClick={() => navigate(SIGN_IN_ROUTE)}
                                    >Авторизация</Button>
                                </Nav>
                            )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>

* */