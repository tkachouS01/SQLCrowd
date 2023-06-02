import React, {useContext, useEffect, useState} from 'react'
import {Breadcrumb, Container} from "react-bootstrap";
import UsersList from "../../components/UserComponents/UsersList";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {getUsers} from "../../httpRequests/userAPI";
import CountList from "../../components/otherComponents/countList";
import {HOME_ROUTE} from "../../utils/constsPath";

const UsersPage = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        getUsers(user).then((bool) => {

        })

    }, [])

    return (
        <div>
            <div style={{background: "rgba(1,1,1,0.05)", padding: '0 5px'}}>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={()=>navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item active>Пользователи</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <CountList text={`В системе ${user.users.length} пользователей`}/>
            <UsersList/>
        </div>
    )
})
export default UsersPage;