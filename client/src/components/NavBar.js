import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Button, Navbar} from "react-bootstrap";
import {Container, Nav} from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom";
import {HOME_ROUTE, SIGN_IN_ROUTE, TASKS_ROUTE, USERS_ROUTE} from "../utils/constsPath";
import {action} from "mobx";
import Logo from "./otherComponents/logo";
import {check, exit} from "../httpRequests/authApi";
import Avatar from "./otherComponents/avatar";

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
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{
            position: "fixed",
            width: "100%",
            height: 50,
            top: 0,
            zIndex: 99
        }}>
            <Container>
                <NavLink to={HOME_ROUTE} style={{color: 'white', textDecoration: "none"}}>
                    <Logo fontSize={20}/>
                </NavLink>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">

                    </Nav>
                    <Nav style={{background: '#212529'}}>
                        {
                            user.isAuth
                                ?
                                (
                                    <Nav className="me-auto" style={{alignItems: "center"}}>


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

                                        <div style={{marginLeft:"20px", display:"flex", flexDirection: "row"}}>
                                            <div style={{
                                                color: 'white',
                                                paddingRight: 10,
                                                textAlign: "center",
                                                alignSelf: "center"
                                            }}>
                                                {user.user.nickname}
                                            </div>
                                            <Avatar width={25} _id={user.user._id}/>
                                        </div>
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