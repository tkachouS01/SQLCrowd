import React from 'react';
import UserItem from "../UserComponents/UserItem";
import TaskItem from "./TaskItem";
import {observer} from "mobx-react-lite";

const TasksList = observer(() => {
    return (
        <div>
            <TaskItem/>
        </div>
    );
});

export default TasksList;