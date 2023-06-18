import React, {useContext, useEffect, useState} from 'react'
import TasksList from "../../components/TaskComponents/TasksList";
import {observer} from "mobx-react-lite";
import {createTask, getTasks, updateInBankTask} from "../../httpRequests/taskAPI";
import {Context} from "../../index";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import MyButton from "../../components/basicElements/myButton";
import CountList from "../../components/otherComponents/countList";
import OneThemeTabs from "../../components/ThemeComponents/OneThemeTabs";
import {HOME_ROUTE, TASK_ONE_ROUTE, TASKS_ROUTE, THEME_ONE_ROUTE, THEMES_ROUTE} from "../../utils/constsPath";
import {Breadcrumb, Button} from "react-bootstrap";
import styles from './tasksPageStyle.module.css'
import TasksBanner from "../../components/basicElements/banners/tasksBanner";

const TasksPage = observer(() => {

    const {task, user} = useContext(Context)

    const {themeId} = useParams();
    const {taskId} = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const [selectedButton1, setSelectedButton1] = useState("bank");
    const [selectedButton2, setSelectedButton2] = useState("all");
    const [isLoading, setIsLoading] = useState(true)

    const [selectedTasks, setSelectedTasks] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let param1 = params.get('section');
        let param2 = params.get('category');

        if (param1) {
            setSelectedButton1(param1);
        } else {
            params.set('section', selectedButton1);
            navigate({search: params.toString()});
        }
        if (param2) {
            setSelectedButton2(param2);
        } else {
            params.set('category', selectedButton2);
            navigate({search: params.toString()});
        }

        getTasks(user, task, themeId, param1, param2)
            .then(data => {
                if (data === false) {
                    navigate(THEME_ONE_ROUTE(themeId))
                }
                setIsLoading(false)
            })
    }, [task, location]);

    let click = () => {
        createTask(user, task, themeId)
            .then((taskId) => {
                navigate(TASK_ONE_ROUTE(+themeId, +taskId))
            })
    }
    const handleClick1 = (button) => {
        setSelectedButton1(button);

        const params = new URLSearchParams(location.search);
        params.set('section', button);
        params.set('category', 'all');
        navigate({search: params.toString()});
    }

    const handleClick2 = (button) => {
        setSelectedButton2(button);

        const params = new URLSearchParams(location.search);
        params.set('category', button);
        navigate({search: params.toString()});
    }
    const clickAddInBank = (inBank) => {
        updateInBankTask(user, task, themeId, selectedTasks, inBank, selectedButton1, selectedButton2)
            .then((res) => {
            })
    }
    useEffect(() => {
    }, [isLoading])
    if (isLoading) return <></>

    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(THEMES_ROUTE())}>Темы</Breadcrumb.Item>
                    <Breadcrumb.Item active>Тема #{themeId} (задачи)</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <OneThemeTabs route={TASKS_ROUTE(themeId)}/>
            <TasksBanner/>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    columnGap: 15,
                    background: 'rgba(0,108,126,0.1)',
                    padding: '0 5px'
                }}>
                    <Button variant="link"
                            onClick={() => handleClick1('bank')}
                            className={selectedButton1 === 'bank' ? styles.active : ''}
                    >В банке</Button>
                    <Button variant="link"
                            onClick={() => handleClick1('evaluation')}
                            className={selectedButton1 === 'evaluation' ? styles.active : ''}
                    >Оценивание</Button>
                    {
                        user.user.role === 'ADMIN'
                            ?
                            <Button variant="link"
                                    onClick={() => handleClick1('admission-to-bank')}
                                    className={selectedButton1 === 'admission-to-bank' ? styles.active : ''}
                            >Допуск задач</Button>
                            : <></>
                    }

                </div>
                <div style={{padding: '0 5px'}}>
                    {
                        selectedButton1 === 'admission-to-bank' && user.user.role === 'ADMIN'
                            ?
                            <>
                                <Button variant="link"
                                        onClick={() => handleClick2('all')}
                                        className={selectedButton2 === 'all' ? styles.active : ''}
                                >Принять решение</Button>
                                <Button variant="link"
                                        onClick={() => handleClick2('accepted')}
                                        className={selectedButton2 === 'accepted' ? styles.active : ''}
                                >Приняты</Button>
                                <Button variant="link"
                                        onClick={() => handleClick2('not-accepted')}
                                        className={selectedButton2 === 'not-accepted' ? styles.active : ''}
                                >Не приняты</Button>
                            </>
                            :
                            <>
                                <Button variant="link"
                                        onClick={() => handleClick2('all')}
                                        className={selectedButton2 === 'all' ? styles.active : ''}
                                >Доступно к решению</Button>
                                <Button variant="link"
                                        onClick={() => handleClick2('not-executed')}
                                        className={selectedButton2 === 'not-executed' ? styles.active : ''}
                                >Не выполнялись</Button>
                                <Button variant="link"
                                        onClick={() => handleClick2('in-progress')}
                                        className={selectedButton2 === 'in-progress' ? styles.active : ''}
                                >В процессе</Button>
                                <Button variant="link"
                                        onClick={() => handleClick2('executed')}
                                        className={selectedButton2 === 'executed' ? styles.active : ''}
                                >Выполнены</Button>
                                <Button variant="link"
                                        onClick={() => handleClick2('my-tasks')}
                                        className={selectedButton2 === 'my-tasks' ? styles.active : ''}
                                >Мои задачи</Button>
                            </>
                    }

                </div>

            </div>
            <div>
                <MyButton text={'Создать задачу'} onClick={click}/>
            </div>

            <CountList text={`В системе ${task.allTasks.length} заданий`}/>
            <div>
                {
                    selectedButton1 === 'admission-to-bank' && selectedButton2 === 'all'
                        ?
                        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", columnGap: 10}}>
                            {
                                selectedTasks.length < task.allTasks.length
                                    ?
                                    <Button
                                        variant={'light'}
                                        onClick={() => {
                                            setSelectedTasks(task.allTasks.map(item => item._id))
                                        }}
                                    >
                                        Выбрать все
                                    </Button>
                                    : <></>
                            }
                            {
                                selectedTasks.length > 0
                                    ?
                                    <Button
                                        variant={'light'}
                                        onClick={() => {
                                            setSelectedTasks([])
                                        }}
                                    >
                                        Отменить выбор
                                    </Button>
                                    : <></>
                            }
                            {
                                selectedTasks.length > 0
                                    ?
                                    <>
                                        <MyButton
                                            text={'Добавить'}
                                            onClick={() => {
                                                clickAddInBank(true)
                                            }}
                                        />
                                        <MyButton
                                            text={'Отклонить'}
                                            onClick={() => {
                                                clickAddInBank(false)
                                            }}
                                        />
                                    </>
                                    : <></>
                            }

                        </div>
                        : <></>
                }


                <TasksList setSelectedTasks={setSelectedTasks} selectedTasks={selectedTasks}/>
                {
                    selectedButton1 === 'admission-to-bank' && selectedButton2 === 'all'
                        ?
                        <div style={{fontSize: 12, marginTop: 30}}>
                            После принятия решения изменить свое решение вы не сможете. Допускать задачу без оценок
                            запрещено, для этого вам понадобится самостоятельно
                            оценить задачу, после этого вам станет доступно принимать решение. После принятия решения
                            происходит проверка
                            оценок по критерию Диксона (поиск некорректных оценок) и они исключаются из итоговой оценки.
                            Также выставляются баллы за оценивание задачи и за создание задачи. Итоговый балл за
                            создание
                            задачи вычисляется следующим образом: вычисляется медиана оценок от обучающихся и от
                            преподавателей
                            и после вычисляется среднее
                        </div>
                        : <></>
                }

            </div>
        </div>

    )

});
export default TasksPage;
