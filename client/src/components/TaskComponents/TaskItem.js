import React, {useContext, useEffect, useState} from 'react';
import {Card, Image, Row} from "react-bootstrap";
import {Context} from "../../index";
import {useNavigate, useParams} from "react-router-dom";
import '../../styles/tasks.css'
import Stat from "./stat";
import {getTasks} from "../../httpRequests/taskAPI";
import {observer} from "mobx-react-lite";
import {TASK_ONE_ROUTE, USER_ONE_ROUTE} from "../../utils/constsPath";
import MyButton from "../basicElements/myButton";
import Avatar from "../otherComponents/avatar";
import authorImage from "../../static/author.png";

const TaskItem = observer(({task}) => {

    const {user} = useContext(Context)
    const navigate = useNavigate()
    const {themeId} = useParams();

    const handleTaskClick = (selectedTask) => {
        let idTask = selectedTask._id;

        navigate(TASK_ONE_ROUTE(themeId, idTask));
    };
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 15,
                background: "white",
                padding: 15,
                borderRadius: 10
            }}>


                <Stat task={task} fullContent={false}/>
                <div style={{alignSelf: "flex-end"}}>
                    <MyButton text={"Перейти на задачу"} onClick={() => handleTaskClick(task)}/>
                </div>


            </div>
        </>
    )

});

export default TaskItem;