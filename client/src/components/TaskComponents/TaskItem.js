import React, {useContext, useEffect, useState} from 'react';
import {Card, Form, Image, Row} from "react-bootstrap";
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

const TaskItem = observer(({task, setSelectedTasks, selectedTasks}) => {

    const {user} = useContext(Context)
    const navigate = useNavigate()
    const {themeId} = useParams();

    const handleTaskClick = (taskId) => {
        navigate(TASK_ONE_ROUTE(themeId, taskId));
    };
    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
                background: `${selectedTasks.includes(task._id) ? 'white' : 'transparent'}`,
                padding: 15,
                borderRadius: 10
            }}>
                {
                    'task_ratings' in task
                        ?
                        <Form.Check
                            type="checkbox"
                            checked={selectedTasks.includes(task._id)}
                            onChange={(e) => setSelectedTasks(selectedTasks.includes(task._id) ? selectedTasks.filter(item => item !== task._id) : [...selectedTasks, task._id])}
                        />
                        : <></>
                }

                <div style={{maxWidth: '100%',flexGrow: 1}}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center",maxWidth: '100%'}}>
                        <span style={{
                            fontWeight: "100",
                            fontFamily: 'Arial',
                            background: 'lightgray',
                            padding: 5,
                            borderRadius: 10,
                            marginRight: 10
                        }}>#{task._id}</span>

                        <div style={{
                            fontWeight: "700",
                            fontFamily: 'Arial',
                            color: 'gray',
                            maxWidth: '100%', paddingRight: 40
                        }}>
                            {
                                task.description ?
                                    <div style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        paddingRight: 30
                                    }}>
                                        {task.description}
                                    </div>
                                    :
                                    <div style={{opacity: 0.5, fontWeight: 100}}>{'Не указано'}</div>
                            }
                        </div>

                    </div>
                    <div
                        style={{
                            display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center",
                            justifyContent: `${'task_ratings' in task ? 'space-between' : 'end'}`
                        }}
                    >
                        {
                            'task_ratings' in task
                                ?
                                <div>
                                    <span>{task.task_ratings.length} оценок</span>
                                    {
                                        task.task_ratings.length === 0
                                            ? <></>
                                            :
                                            <span style={{paddingLeft: 15}}>
                                                среднее: {(task.task_ratings.reduce((accum, item) => accum + item.rating, 0) / task.task_ratings.length).toFixed(2)}
                                            </span>

                                    }
                                </div>
                                : <></>
                        }

                        <MyButton text={"Перейти на задачу"} onClick={() => handleTaskClick(task._id)}/>
                    </div>
                </div>
            </div>
        </>
    )

});

export default TaskItem;