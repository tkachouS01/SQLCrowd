import React, {useContext, useEffect, useState} from 'react'
import {Context} from "../../index";
import {addRatingOneTask, getOneTask, updateTask} from "../../httpRequests/taskAPI";
import {Accordion, Breadcrumb, Button, Container, Form, Modal, Table} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import Stat from "../../components/TaskComponents/stat";
import EditTaskComponent from "../../components/TaskComponents/EditTaskComponent";
import TableView from "../../components/TaskComponents/tableView";
import EditSolutionComponent from "../../components/TaskComponents/EditSolutionComponent";
import {HOME_ROUTE, TASKS_ROUTE, THEMES_ROUTE} from "../../utils/constsPath";
import TextareaAutosize from "react-textarea-autosize";
import StarRating from "../../components/SolutionComponents/StarRating";
import MyButton from "../../components/basicElements/myButton";
import {toJS} from "mobx";
import TaskStatusAuthor from "../../components/basicElements/taskStatusAuthor";
import {convertDate} from "../../utils/utils";
import {observer} from "mobx-react-lite";


const OneTaskPage = (observer(() => {
    const [isLoading, setIsLoading] = useState(true)
    let {user, task, solution} = useContext(Context)

    const {themeId, taskId} = useParams();

    let navigate = useNavigate();

    const [selectedTable, setSelectedTable] = useState("")
    const [selectedDatabaseName, setSelectedDatabaseName] = useState(undefined);
    const [descriptionTask, setDescriptionTask] = useState('')
    const [tableNames, setTableNames] = useState([])


    const [commentValue, setCommentValue] = useState('')
    const [ratingValue, setRatingValue] = useState(0)


    useEffect(() => {
        getOneTask(user, task, themeId, taskId)
            .then((result) => {
                if (!result) navigate(TASKS_ROUTE(themeId));
                if (task.currentTask.database) {
                    let temp = Object.keys(task.databasesData);

                    setTableNames(temp)
                    setSelectedTable(temp[0])
                    setSelectedDatabaseName(task.currentTask.database.name)
                }
                setDescriptionTask(task.currentTask.description || '');


                setRatingValue(task.currentTask.ratingTask.myRating.value || 0)
                setCommentValue(task.currentTask.ratingTask.myComment || '')
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }, [])
    let save = () => {
        setIsLoading(true)
        updateTask(user, task, taskId, selectedDatabaseName, descriptionTask, themeId)
            .then(async result => {
                if (task.currentTask.database) {
                    let temp = Object.keys(task.databasesData);

                    setTableNames(temp)
                    setSelectedTable(temp[0])
                    setSelectedDatabaseName(task.currentTask.database.name)
                }
                setDescriptionTask(task.currentTask.description || '');
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
    }, [isLoading])

    const clickEvaluation = () => {
        addRatingOneTask(user, task, themeId, taskId, commentValue, ratingValue)
            .then(() => {
            })
    }

    if (isLoading) {
        return <></>
    }

    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(THEMES_ROUTE())}>Темы</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(TASKS_ROUTE(themeId))}>Тема
                        #{themeId} (задачи)</Breadcrumb.Item>
                    <Breadcrumb.Item active>Задача #{taskId}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Stat task={task.currentTask} fullContent={true}/>
            <Accordion
                style={{marginTop: 15}}
                defaultActiveKey={
                    task.currentTask.myProgress === 'Не выполнялось'
                        ? (task.currentTask.user._id === user.user._id ? '0' : '1')
                        : '1'
                }>
                {
                    task.currentTask.user._id === user.user._id && (task.currentTask.user._id === user.user._id & (task.currentTask.myProgress === 'Не выполнялось' || solution.oneSolution.finished === false))
                        ?
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Редактирование задачи</Accordion.Header>
                            <Accordion.Body>
                                <EditTaskComponent
                                    id={taskId}
                                    descriptionTask={descriptionTask}
                                    setDescriptionTask={setDescriptionTask}
                                    selectedDatabaseName={selectedDatabaseName}
                                    setSelectedDatabaseName={setSelectedDatabaseName}
                                    onSave={save}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        : <></>
                }
                {
                    !task.currentTask.description || !task.currentTask.database
                        ? <></>
                        :
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Решение задачи</Accordion.Header>
                            <Accordion.Body>
                                <EditSolutionComponent/>

                                <TableView
                                    selectedTable={selectedTable}
                                    setSelectedTable={setSelectedTable}
                                    tableNames={tableNames}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                }

                {
                    task.currentTask.ratingTask.createdAt || (task.currentTask.inBank === null &&
                        task.currentTask.finished === true &&
                        (task.currentTask.user._id !== user.user._id || user.user.role === 'ADMIN'))
                        ?
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Оценивание задачи</Accordion.Header>
                            <Accordion.Body>
                                <TextareaAutosize
                                    style={{
                                        resize: "none",
                                        width: '100%',
                                        border: '1px solid gray',
                                        padding: '10px',
                                        borderRadius: 10,
                                        borderStyle: "none"
                                    }}
                                    placeholder={'Отзыв на задачу не введен'}
                                    autoFocus
                                    value={commentValue}
                                    onChange={(e) => setCommentValue(e.target.value)}
                                    readOnly={task.currentTask.ratingTask.createdAt !== null}
                                />
                                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", columnGap: 15}}>
                                    <div>
                                        <StarRating
                                            initialStars={ratingValue}
                                            onRating={(rating) => {
                                                setRatingValue(rating)
                                            }}
                                            readonly={task.currentTask.ratingTask.createdAt !== null}
                                        />
                                        {
                                            task.currentTask.ratingTask.createdAt
                                                ?
                                                <>
                                                    <div style={{marginTop: 10}}>
                                                        {
                                                            task.currentTask.ratingTask.myRating.verified === null
                                                                ? <span className={'main-color-yellow'}>Оценка не проходила проверку</span>
                                                                : task.currentTask.ratingTask.myRating.verified
                                                                    ? <span className={'main-color-green'}>Оценка адекватная</span>
                                                                    : <span className={'main-color-red'}>Оценка является выбросом по критерию Диксона</span>
                                                        }
                                                    </div>
                                                    <div>Оценено {convertDate(task.currentTask.ratingTask.createdAt)}</div>
                                                </>
                                                : <></>
                                        }

                                    </div>
                                    {
                                        task.currentTask.ratingTask.createdAt !== null
                                            ? <></>
                                            : <MyButton text={"Оценить задачу"} onClick={clickEvaluation}/>
                                    }

                                </div>

                            </Accordion.Body>
                        </Accordion.Item>
                        : <></>
                }
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Результаты автоматической проверки задачи</Accordion.Header>
                    <Accordion.Body>
                        <div style={{marginBottom: 15}}>
                            <TaskStatusAuthor/>
                        </div>

                        <Table bordered responsive>
                            <thead>
                            <tr  className={'main-color-blue'}>
                                <th style={{fontWeight: 100, textAlign: "center"}}>Проверка синтаксиса запроса</th>
                                <th style={{fontWeight: 100, textAlign: "center"}}>Проверка на плагиат формулировки
                                    задачи
                                </th>
                                <th style={{fontWeight: 100, textAlign: "center"}}>Проверка на плагиат SQL-кода
                                    решения
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {
                                    task.currentTask.autoTaskCheck.checkingSyntaxOfCode
                                        ?
                                        <td className='main-color-green' style={{textAlign: "center", fontWeight: 500}}>
                                            Пройдена
                                        </td>
                                        :
                                        <td className='main-color-red' style={{textAlign: "center", fontWeight: 500}}>
                                            Не пройдена
                                        </td>
                                }
                                {
                                    task.currentTask.autoTaskCheck.simpleConditionCheck.check
                                        ?
                                        <td className='main-color-green' style={{textAlign: "center", fontWeight: 500}}>
                                            Пройдена
                                            <div style={{fontWeight: 100}}>
                                                плагиат {task.currentTask.autoTaskCheck.simpleConditionCheck.value}%
                                            </div>
                                        </td>
                                        :
                                        <td className='main-color-red' style={{textAlign: "center", fontWeight: 500}}>
                                            Не пройдена
                                            <div style={{fontWeight: 100}}>
                                                плагиат {task.currentTask.autoTaskCheck.simpleConditionCheck.value}%
                                            </div>
                                        </td>
                                }
                                {
                                    task.currentTask.autoTaskCheck.complexConditionCheck.check
                                        ?
                                        <td className='main-color-green' style={{textAlign: "center", fontWeight: 500}}>
                                            Пройдена
                                            <div style={{fontWeight: 100}}>
                                                плагиат {task.currentTask.autoTaskCheck.complexConditionCheck.value}%
                                            </div>
                                        </td>
                                        :
                                        <td className='main-color-red' style={{textAlign: "center", fontWeight: 500}}>
                                            Не пройдена
                                            <div style={{fontWeight: 100}}>
                                                плагиат {task.currentTask.autoTaskCheck.complexConditionCheck.value}%
                                            </div>
                                        </td>
                                }
                            </tr>
                            </tbody>
                        </Table>
                        <div style={{marginBottom: 15, fontSize: 13, fontWeight: 100}}>
                            Проверка задачи происходит после завершения авторского решения. Если задача не проходит одну
                            из
                            автоматических проверок, то она сразу не допускается в банк задач. Если задачу создавал
                            преподаватель,
                            и она прошла проверки - то она допускается в банка задач автоматически.
                            Максимально допустимый процент плагиата ~85%. Если задачу создавал обучающийся, то
                            после этого задача выставляется другим пользователям на оценивание, после чего по
                            результатам оценивания
                            преподаватель принимает решение о допуске задачи в банк задач
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}));
export default OneTaskPage;