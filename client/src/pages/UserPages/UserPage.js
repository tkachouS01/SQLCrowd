import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../../index";
import {getOneUser, getUsers} from "../../httpRequests/userAPI";
import {useNavigate, useParams} from "react-router-dom";
import Avatar from "../../components/otherComponents/avatar";
import {Breadcrumb, Image} from "react-bootstrap";
import {convertDate} from "../../utils/utils";
import MyButton from "../../components/basicElements/myButton";
import {updateRole} from "../../httpRequests/roleRequestsAPI";
import {HOME_ROUTE, USERS_ROUTE} from "../../utils/constsPath";

const UserPage = () => {
    const {user} = useContext(Context)
    const {userId} = useParams();
    const [userRole, setUserRole] = useState(null)
    const [isFinish, setIsFinish] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        getOneUser(user, userId).then(() => {
            setIsFinish(true);
            setUserRole(user.currentProfile.role)
        })

    })
    useEffect(() => {
    }, [isFinish, user.currentProfile.role])

    const updateRoleClick = () => {
        updateRole(user, "", user.currentProfile._id)
            .then((res) => {
                setUserRole(res)
            })
    }
    if (isFinish === false || isFinish === undefined) return <></>
    else {

        return (
            <div>
                <div style={{background: "rgba(1,1,1,0.05)", padding: '0 5px'}}>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => navigate(USERS_ROUTE())}>Пользователи</Breadcrumb.Item>
                        <Breadcrumb.Item active>{user.currentProfile.nickname}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>

                    <div style={{position: "relative"}}>
                        <div>
                            <Avatar _id={userId} bigVariant={true} variant={1}/>
                        </div>

                        <div style={{
                            position: "relative",
                            top: '-10vmin',
                            marginBottom: '-10vmin',
                            left: '10px',
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end"
                        }}>
                            <Avatar _id={userId} bigVariant={true} variant={2}/>
                            <div style={{paddingLeft: '20px'}}>
                                <div style={{fontSize: 30, fontWeight: 700}}>
                                    [{user.currentProfile._id}] {user.currentProfile.nickname}
                                </div>

                            </div>

                        </div>


                    </div>

                    <div>
                        <hr/>
                        <div style={{textTransform: "uppercase"}}>
                            <span>{user.currentProfile.name} </span>
                            <span>{user.currentProfile.patronymic} </span>
                            <span style={{fontWeight: 500}}>{user.currentProfile.surname}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 500, paddingRight: '20px'}}>Зарегистрирован</span>
                            <span>{convertDate(user.currentProfile.createdAt)}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 500, paddingRight: '20px'}}>Дата рождения </span>
                            <span>{convertDate(user.currentProfile.date_of_birth).split(",")[0]}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 500, paddingRight: '20px'}}>Пол </span>
                            <span>{user.currentProfile.gender === 'Ж' ? 'Женский' : 'Мужской'}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 500, paddingRight: '20px'}}>Email </span>
                            <span>{user.currentProfile.email}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 500, paddingRight: '20px'}}>Роль </span>
                            <span>{userRole === 'USER' ? 'обучающийся' : 'преподаватель'}</span>
                        </div>
                        {
                            user.currentProfile._id === 1 || user.user.role === 'USER'
                                ? <></>
                                : <MyButton
                                    text={`${userRole === 'USER' ? 'Назначить преподавателем' : 'Назначить обучающимся'}`}
                                    onClick={updateRoleClick}/>
                        }

                    </div>
                </div>
            </div>

        )
    }

}
export default UserPage;