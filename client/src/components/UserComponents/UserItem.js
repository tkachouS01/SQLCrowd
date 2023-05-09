import React, {useContext, useEffect, useState} from 'react';
import {Card, Image, Row} from "react-bootstrap";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {USERS_ROUTE} from "../../utils/constsPath";
import {getUsers} from "../../httpRequests/userApi";
import {convertDate} from "../../utils/utils";
import Avatar from "../otherComponents/avatar";

const UserItem = () => {

    const {user} = useContext(Context)
    const [requestCompleted, setRequestCompleted] = useState(false)
    useEffect(()=>{
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
                            key={user._id}
                            onClick={() => navigate(`${USERS_ROUTE}/${user._id}`)}
                            className="d-flex flex-row justify-content-between"
                        >
                            <div>
                                <div style={{paddingRight: 5}}>id{user._id}</div>
<Avatar width={100} _id={user._id}/>
                                <div>{convertDate(user.createdAt)}</div>
                            </div>

                            <div className="d-flex flex-column align-items-end align-self-center">
                                <div style={{textAlign: "end"}}>{user.nickname}</div>

                                <div style={{textAlign: "end"}}>{`${user.surname || ''} ${user.name || ''} ${user.patronymic || ''}`}</div>
                                <div style={{textAlign: "end"}}>{user.date_of_birth || 'не указано'}</div>

                            </div>


                        </Card>
                    )
                }
            </Row>
        </>

    );
};

export default UserItem;