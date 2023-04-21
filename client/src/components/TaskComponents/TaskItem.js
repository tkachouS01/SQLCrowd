import React, {useContext, useEffect, useState} from 'react';
import {Card, Row} from "react-bootstrap";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import '../../styles/tasks.css'
import Stat from "./stat";
import {getTasks} from "../../httpRequests/taskApi";
import {observer} from "mobx-react-lite";

const TaskItem = observer(() => {
    const {task} = useContext(Context)
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [requestCompleted, setRequestCompleted] = useState(false)
    useEffect( () => {
        getTasks(user, task)
            .then((bool)=>{
                setRequestCompleted(bool)
            })
    }, [user, task]);



    const handleTaskClick = (selectedTask) => {
        let idTask = selectedTask.id;
        task.setSelectedTask(selectedTask);

        navigate(`/tasks/${idTask}`);
    };
    useEffect(()=>{},[requestCompleted])
    if (!requestCompleted) return <></>
    return (
        <>
            <div style={{textAlign: "end"}}>В системе {task.tasks.length} заданий</div>
            <Row style={{ display:"flex",flexDirection:"column",gap:15,background: "white", padding: 15, borderRadius: 10}}>
            {
                task.tasks.map(taskOne =>
                    (
                        <Card
                            style={{
                                cursor: "pointer"
                            }}
                            key={taskOne.id}
                            onClick={() => handleTaskClick(taskOne)}
                            className="d-flex flex-row justify-content-between flex-column"
                        >
                            <Stat task={taskOne} fullContent={false}/>
                        </Card>
                    )
                )
            }
        </Row>
        </>
    )

});

export default TaskItem;