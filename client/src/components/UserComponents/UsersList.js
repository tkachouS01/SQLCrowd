import React, {useContext} from 'react';
import UserItem from "./UserItem";
import {Context} from "../../index";

const UsersList = () => {
    const {user} = useContext(Context)

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