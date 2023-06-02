import React, {useContext} from 'react';
import TaskItem from "./TaskItem";
import {observer} from "mobx-react-lite";
import UserItem from "../UserComponents/UserItem";
import {Context} from "../../index";

const TasksList = observer(() => {
    const {task} = useContext(Context)
    return (
        <>
            {
                task.allTasks.length===0
                ?<div style={{textAlign: "center"}}>Задач нет</div>
                    :
                    <>
                        {
                            task.allTasks.map((item, index) =>
                                <div key={index}>
                                    <TaskItem task={item}/>
                                    {index + 1 === task.allTasks.length ? <></> : <hr/>}
                                </div>
                            )
                        }
                    </>

            }
        </>
    );
});

export default TasksList;