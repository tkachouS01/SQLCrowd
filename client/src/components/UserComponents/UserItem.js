import React from 'react';
import {useNavigate} from "react-router-dom";
import {USER_ONE_ROUTE} from "../../utils/constsPath";
import {convertDate} from "../../utils/utils";
import Avatar from "../otherComponents/avatar";
import MyButton from "../basicElements/myButton";

const UserItem = ({user}) => {

    const navigate = useNavigate()
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between"
        }}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{marginRight: 20}}>
                    <Avatar width={80} _id={user._id}/>
                </div>

                <div className="d-flex flex-column">
                    <div style={{fontWeight: 700, fontSize: 30}}>[{user._id}] {user.nickname}</div>
                    <div
                        style={{
                            fontWeight: 100,
                            textDecoration: "underline"
                        }}
                    >
                        {user.role === 'USER' ? '' : 'Преподаватель'}
                    </div>
                    <div>{`${user.surname || ''} ${user.name || ''} ${user.patronymic || ''}`}</div>
                    <div>
                        <span style={{fontWeight: 500}}>Зарегистрирован </span>
                        <span>{convertDate(user.createdAt)}</span>
                    </div>

                </div>
            </div>
            <div style={{alignSelf: "flex-end"}}>
                <MyButton text={"Перейти в профиль"} onClick={() => navigate(USER_ONE_ROUTE(user._id))}/>
            </div>


        </div>

    );
};

export default UserItem;