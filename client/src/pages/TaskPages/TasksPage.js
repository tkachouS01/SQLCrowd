import React, {useContext, useEffect, useState} from 'react'
import TasksList from "../../components/TaskComponents/TasksList";
import {Button, Container, Image} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import plusIcon from '../../static/plus.png'
import {createTask, getTasks} from "../../httpRequests/taskApi";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";

const TasksPage = observer(() => {
    const {task} = useContext(Context)
    const {user} = useContext(Context)
    const navigate = useNavigate()

    let click =()=>{
        createTask(user,task,navigate)
            .then((bool)=>{

            })
    }
    return (
        <>
            <Image
                src={plusIcon}
                style={{
                    height: 50,
                    width: 50,
                    position: 'fixed',
                    bottom: '10px',
                    left: '10px',
                    cursor: "pointer",
                    zIndex: 99
                }}
                onClick={() =>{click()}}
            />

            <Container className="col-md-9" style={{position: "relative"}}>

                <TasksList/>
            </Container>
        </>

    )

});
export default TasksPage;