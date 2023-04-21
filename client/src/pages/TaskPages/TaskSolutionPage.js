import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../../index";
import {getOneTask, getTasks, updateTask} from "../../httpRequests/taskApi";
import {Button, Container, Form, Table} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {toJS} from "mobx";
import Stat from "../../components/TaskComponents/stat";
import CodeEditor from "../../components/TaskComponents/CodeEdit";
import EditTaskComponent from "../../components/TaskComponents/EditTaskComponent";
import TableView from "../../components/TaskComponents/tableView";
import EditSolutionComponent from "../../components/TaskComponents/EditSolutionComponent";

const TaskSolutionPage = (() => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)
    const [requestCompleted, setRequestCompleted] = useState(false)

    const {id} = useParams();
    task.setSelectedTask(id)
    let navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState("")
    const [selectedDatabaseName, setSelectedDatabaseName] = useState(undefined);
    const [descriptionTask, setDescriptionTask] = useState('')
    const [startSolution, setStartSolution] = useState(false)
    const [tableNames, setTableNames] = useState([])

    let getTask = async () => {
        setRequestCompleted(false)
        await getOneTask(user, task, task.selectedTask)
            .then((result) => {
                if (!result) return;
                if (task.task.info.database) {
                    let temp = Object.keys(task.task.data);
                    setTableNames(temp)
                    setSelectedTable(temp[0])
                    setSelectedDatabaseName(task.task.info.database.name)
                }
                setDescriptionTask(task.task.info.description || '');
                setRequestCompleted(result);
            })
    }
    useEffect(() => {
        getTask().then(() => {
        })
    }, [])
    let save = () => {
        setRequestCompleted(false)
        updateTask(user, task, navigate, task.selectedTask, selectedDatabaseName, descriptionTask)
            .then(async data => {
                getTask().then((result) => {
                })
            })
    }

    if (!requestCompleted) {
        return <></>
    }
    return (
        <Container className="col-md-9" style={{display: "flex", flexDirection: "column", gap: 15, width: "100%"}}>
            <Stat task={task.task.info} fullContent={true}/>

            <EditTaskComponent
                id={id}
                descriptionTask={descriptionTask}
                setDescriptionTask={setDescriptionTask}
                selectedDatabaseName={selectedDatabaseName}
                setSelectedDatabaseName={setSelectedDatabaseName}
                onSave={save}
            />
            <EditSolutionComponent/>
            <TableView
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                tableNames={tableNames}
            />
        </Container>
    )
});
export default TaskSolutionPage;