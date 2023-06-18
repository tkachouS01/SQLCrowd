import React, {useContext} from 'react';
import {Context} from "../../index";

const TaskStatusAuthor = () => {
    const {task} = useContext(Context)
    return (
        <div>
            {
                task.currentTask.finished === null || task.currentTask.finished === false
                    ?
                    <div
                        className='main-color-blue'
                        style={{display: "inline-block", padding: '2px 20px', borderRadius: 10}}
                    >
                        СОЗДАНИЕ ЗАДАЧИ
                    </div>
                    : task.currentTask.inBank === null
                        ?
                        <div
                            className='main-color-yellow'
                            style={{display: "inline-block", padding: '2px 20px', borderRadius: 10}}
                        >
                            НА ОЦЕНИВАНИИ
                        </div>
                        : task.currentTask.inBank
                            ?
                            <div
                                className='main-color-green'
                                style={{display: "inline-block", padding: '2px 20px', borderRadius: 10}}
                            >
                                БАНК
                            </div>
                            :
                            <div
                                className='main-color-red'
                                style={{display: "inline-block", padding: '2px 20px', borderRadius: 10}}
                            >
                                НЕ БАНК ;(
                            </div>
            }
        </div>
    );
};

export default TaskStatusAuthor;