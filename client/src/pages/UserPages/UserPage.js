import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../../index";
import {addImageProfile, getOneUser, getUsers} from "../../httpRequests/userAPI";
import {useNavigate, useParams} from "react-router-dom";
import Avatar from "../../components/otherComponents/avatar";
import {Breadcrumb, Button, Form, Image} from "react-bootstrap";
import {convertDate, simpleConvertDate} from "../../utils/utils";
import MyButton from "../../components/basicElements/myButton";
import {updateRole} from "../../httpRequests/roleRequestsAPI";
import {HOME_ROUTE, USERS_ROUTE} from "../../utils/constsPath";

const UserPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const {user} = useContext(Context)
    const {userId} = useParams();
    const [userRole, setUserRole] = useState(null)
    const navigate = useNavigate()
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const handleUpload = () => {
        setIsLoading(true)
        addImageProfile(user, userId, selectedFile)
            .then(() => {
                setSelectedFile(null);
                setIsLoading(false)
            })
            .catch(() => {
                setSelectedFile(null);
                setIsLoading(false)
            })
    }


    useEffect(() => {
        getOneUser(user, userId).then(() => {
            setUserRole(user.currentProfile.role)
            setIsLoading(false)
        })
            .catch(() => {
                setIsLoading(false)
            })
    })
    useEffect(() => {
    }, [isLoading, user.currentProfile.role])

    const updateRoleClick = () => {

        updateRole(user, "", user.currentProfile._id)
            .then((res) => {
                setUserRole(res)
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }
    if (isLoading)
        return <></>
    else {

        return (
            <div>
                <div>
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
                        {
                            userId == 0
                                ?
                                <div>
                                    <div>ЭТО ОЧЕНЬ СЕКРЕТНЫЙ ПОЛЬЗОВАТЕЛЬ</div>
                                    <div>ВЫ НЕ ДОЛЖНЫ ЕГО ВИДЕТЬ</div>
                                </div>
                                :
                                <>
                                    {
                                        user.currentProfile._id === user.user._id || (user.user.role === 'ADMIN' && userRole === 'USER')
                                            ?
                                            <div style={{
                                                display: "inline-flex",
                                                marginBottom: 10,
                                                marginLeft: 5,
                                                alignItems: "center",
                                                columnGap: 5
                                            }}>
                                                <Form.Control
                                                    type="file"
                                                    placeholder=" "
                                                    accept="image/jpeg,image/png"
                                                    onChange={handleFileChange}
                                                />
                                                <MyButton text={selectedFile ? "Сохранить" : "Удалить"}
                                                          onClick={handleUpload}/>
                                            </div>
                                            : <></>
                                    }

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
                                        <span>{simpleConvertDate(user.currentProfile.date_of_birth).split(",")[0]}</span>
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
                                </>
                        }


                    </div>
                </div>
            </div>

        )
    }

}
export default UserPage;