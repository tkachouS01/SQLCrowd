import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../../index";
import {getOneTask, updateTask} from "../../httpRequests/taskAPI";
import {Breadcrumb, Container} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import Stat from "../../components/TaskComponents/stat";
import EditTaskComponent from "../../components/TaskComponents/EditTaskComponent";
import TableView from "../../components/TaskComponents/tableView";
import EditSolutionComponent from "../../components/TaskComponents/EditSolutionComponent";
import {HOME_ROUTE, TASKS_ROUTE, THEMES_ROUTE} from "../../utils/constsPath";

const OneTaskPage = (() => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)

    const {themeId, taskId} = useParams();

    let navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState("")
    const [selectedDatabaseName, setSelectedDatabaseName] = useState(undefined);
    const [descriptionTask, setDescriptionTask] = useState('')
    const [tableNames, setTableNames] = useState([])


    useEffect(() => {
        setIsLoading(true)
        getOneTask(user, task, themeId, taskId)
            .then((result) => {
                if (!result) return;
                if (task.currentTask.database) {
                    let temp = Object.keys(task.databasesData);
                    setTableNames(temp)
                    setSelectedTable(temp[0])
                    setSelectedDatabaseName(task.currentTask.database.name)
                }
                setDescriptionTask(task.currentTask.description || '');
                setIsLoading(false)
            })
            .catch(()=>setIsLoading(false))
    }, [])
    let save = () => {
        setIsLoading(true)
        updateTask(user, task, navigate, taskId, selectedDatabaseName, descriptionTask,themeId)
            .then(async data => {
                setIsLoading(false)
            })
            .catch(()=>{setIsLoading(false)})
    }
useEffect(()=>{},[isLoading])
    if (isLoading) {
        return <></>
    }


    return (
        <div >
            <div style={{background: "rgba(1,1,1,0.05)", padding: '0 5px'}}>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(THEMES_ROUTE())}>Темы</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(TASKS_ROUTE(themeId))}>Тема #{themeId} (задачи)</Breadcrumb.Item>
                    <Breadcrumb.Item active>Задача #{taskId}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Stat task={task.currentTask} fullContent={true}/>

            <EditTaskComponent
                id={taskId}
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
        </div>
    )
});
export default OneTaskPage;