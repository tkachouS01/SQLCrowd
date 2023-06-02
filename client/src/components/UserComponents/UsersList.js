import React, {useContext} from 'react';
import UserItem from "./UserItem";
import {Button, Card, Row} from "react-bootstrap";
import {USERS_ROUTE} from "../../utils/constsPath";
import Avatar from "../otherComponents/avatar";
import {convertDate} from "../../utils/utils";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";

const UsersList = () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    return (
        <>
            {
                user.users.map((userItem, index) =>
                    <div key={index}>
                        <UserItem user={userItem}/>
                        {index + 1 === user.users.length ? <></> : <hr/>}
                    </div>
                )
            }
        </>
    );
};

export default UsersList;