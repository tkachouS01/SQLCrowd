import React from 'react';
import {USER_ONE_ROUTE} from "../../utils/constsPath";
import Avatar from "../otherComponents/avatar";
import {useNavigate} from "react-router-dom";

const UserImgLink = ({_id, nickname, role}) => {
    const navigate = useNavigate()
    return (
        <div>
            <div
                style={{
                    marginLeft: 5,
                    display: "inline-flex",
                    flexDirection: "row",
                    cursor: "pointer",
                    background: "rgba(0, 92, 124, 0.2)",
                    padding: '3px 10px',
                    borderRadius: 10,
                    userSelect: "none"
                }}
                onClick={() => navigate(USER_ONE_ROUTE(_id))}
            >
                <div style={{
                    color: `${role === 'ADMIN' ? 'rgb(124,0,14)' : "rgb(0, 92, 124)"}`,
                    paddingRight: 10,
                    alignSelf: "center",
                }}>
                    {nickname}
                </div>
                <Avatar width={25} _id={_id}/>
            </div>
        </div>
    );
};

export default UserImgLink;