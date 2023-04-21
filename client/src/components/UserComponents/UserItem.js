import React, {useContext, useEffect, useState} from 'react';
import {Card, Container, Image, Row} from "react-bootstrap";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {USERS_ROUTE} from "../../utils/constsPath";
import {getUsers} from "../../httpRequests/userApi";
import {convertDate} from "../../utils/utils";

const UserItem = () => {

    const {user} = useContext(Context)
    const [requestCompleted, setRequestCompleted] = useState(false)
    useEffect((bool)=>{
        getUsers(user).then((bool)=>{
            setRequestCompleted(bool)
        })

    },[])
    const navigate = useNavigate()
    useEffect(()=>{},[requestCompleted])
    if (!requestCompleted) return <></>
    return (
        <>
            <div style={{textAlign: "end"}}>В системе {user.users.length} пользователей</div>
            <Row  style={{ display:"flex",flexDirection:"column",gap:15,background: "white", padding: 15, borderRadius: 10}}>
                {
                    user.users.map(user =>
                        <Card
                            style={{cursor: "pointer"}}
                            key={user.id}
                            onClick={() => navigate(`${USERS_ROUTE}/${user.id}`)}
                            className="d-flex flex-row justify-content-between"
                        >
                            <div>
                                <div style={{paddingRight: 5}}>id{user.id}</div>
                                <Image src={`https://picsum.photos/200?random=${user.id}`}
                                       style={{width: 100, height: 100, borderRadius: 50}}/>
                                <div>{convertDate(user.createdAt)}</div>
                            </div>

                            <div className="d-flex flex-column align-items-end align-self-center">
                                <div>Ник: {user.nickname}</div>

                                <div>{`${user.surname || ''} ${user.name || ''} ${user.patronymic || ''}`}</div>
                                <div>День рождения: {user.date_of_birth || 'не указано'}</div>

                            </div>


                        </Card>
                    )
                }
            </Row>
        </>

    );
};

export default UserItem;