import React, {useContext, useEffect, useState} from 'react';
import {getRating} from "../../httpRequests/ratingAPI";
import {Context} from "../../index";
import {useNavigate, useParams} from "react-router-dom";
import {Accordion, Image, Table} from "react-bootstrap";
import EditTaskComponent from "../../components/TaskComponents/EditTaskComponent";
import {SOLUTION_ONE_ROUTE, SOLUTIONS_ROUTE, TASK_ONE_ROUTE, THEME_ONE_ROUTE} from "../../utils/constsPath";
import {convertDate} from "../../utils/utils";
import createImage from './../../static/create.png'
import updateImage from './../../static/update.png'

const UserStat = () => {
    const {user, rating} = useContext(Context)
    const {userId} = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(userId)
        getRating(user, rating, userId)
            .then(() => {
                setIsLoading(false);
            })
    }, []);
    useEffect(() => {
    }, [isLoading])
    if (isLoading) return <></>
    console.log(rating.usersRating[0])
    return (
        <div style={{marginTop: 15}}>
            <Table bordered responsive>
                <thead>
                <tr className={'main-color-blue'}>
                    <th>В банке</th>
                    <th>Из банка</th>
                    <th>Создано</th>
                    <th>Оценено</th>
                    <th>Баллы</th>
                    <th>Средняя оценка</th>
                    <th>Текущий рейтинг</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{rating.usersRating[0].tasksInBank}</td>
                    <td>{rating.usersRating[0].solutionsFromBank}</td>
                    <td>{rating.usersRating[0].tasksCreated}</td>
                    <td>
                        {rating.usersRating[0].tasksEvaluated}
                        <br/>
                        <span style={{fontSize: 10}}>
                            {
                                rating.usersRating[0].sameRating
                                    ? ``
                                    : ''
                            }
                        </span>
                    </td>
                    <td>{+(rating.usersRating[0].scores.toFixed(2))}</td>
                    <td>{+(rating.usersRating[0].averageRating.toFixed(2))}</td>
                    <td>
                        {+(rating.usersRating[0].currentRating.toFixed(2))}
                        <span style={{marginLeft: 5, fontWeight: 500}}>
                            {
                                rating.usersRating[0].currentRating === 5
                                    ? '(отличник)'
                                    : rating.usersRating[0].currentRating >= 4
                                        ? '(хорошист)'
                                        : rating.usersRating[0].currentRating >= 3
                                            ? '(троечник)'
                                            : '(двоечник)'
                            }
                        </span>

                    </td>
                </tr>
                </tbody>
            </Table>
            <Accordion defaultActiveKey={0}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Задачи добавленные в банк</Accordion.Header>
                    <Accordion.Body>
                        <div>
                            {
                                rating.usersRating[0].tasksInBankValues.length === 0
                                    ? <div>Задач нет</div>
                                    :
                                    <Table bordered responsive>
                                        <thead>
                                        <tr>
                                            <th>Тема</th>
                                            <th>Задача</th>
                                            <th>Решение</th>
                                            <th>БД</th>
                                            <th>Даты</th>
                                            <th>Описание</th>
                                            <th>Баллы</th>
                                            <th>Оценка</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            rating.usersRating[0].tasksInBankValues.map((item, index) =>
                                                <tr key={index}>
                                                    <td onClick={() => navigate(THEME_ONE_ROUTE(item.themeId))}
                                                        className={'hoverEffect'}
                                                    >
                                                        <span style={{
                                                            fontSize: 25,
                                                            fontWeight: 100
                                                        }}>#</span>{item.themeId}
                                                    </td>

                                                    <td onClick={() => navigate(TASK_ONE_ROUTE(item.themeId, item._id))}
                                                        className={'hoverEffect'}>
                                                        <span style={{fontSize: 25, fontWeight: 100}}>#</span>{item._id}
                                                    </td>

                                                    <td onClick={() => navigate(SOLUTIONS_ROUTE(item.themeId, item._id,userId))}
                                                        className={'hoverEffect'}>
                                                        <span style={{fontSize: 25, fontWeight: 100}}>#</span>{item.solutions[0]._id}
                                                    </td>

                                                    <td>{item.database.name}</td>
                                                    <td>
                                                        <div style={{display: "flex", flexDirection: "column"}}>
                                                            <div>
                                                                <Image src={createImage} height={25}
                                                                       style={{marginRight: 5}}/>{convertDate(item.createdAt)}
                                                            </div>
                                                            <div>
                                                                <Image src={updateImage} height={25}
                                                                       style={{marginRight: 5}}/>{convertDate(item.updatedAt)}
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td>{item.description}</td>
                                                    <td>{item.task_creation_score ? +(item.task_creation_score.score.score.toFixed(2)) : ''}</td>
                                                    <td>
                                                        {item.task_creation_score ? +(item.task_creation_score.score.score.toFixed(2)) : ''}
                                                        <br/>
                                                        {
                                                            item.task_creation_score
                                                                ? <span
                                                                    style={{fontSize: 10}}>{convertDate(item.task_creation_score.updatedAt)}</span>
                                                                : ''
                                                        }

                                                    </td>
                                                </tr>
                                            )
                                        }

                                        </tbody>
                                    </Table>
                            }

                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Решенные задачи из банка</Accordion.Header>
                    <Accordion.Body>
                        <div>
                            {
                                rating.usersRating[0].solutionsFromBankValues.length === 0
                                    ? <div>Задач нет</div>
                                    :
                                    <Table bordered responsive>
                                        <thead>
                                        <tr>
                                            <th>Тема</th>
                                            <th>Задача</th>
                                            <th>Решение</th>
                                            <th>БД</th>
                                            <th>Даты</th>
                                            <th>Описание</th>
                                            <th>Баллы</th>
                                            <th>Оценка</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            rating.usersRating[0].solutionsFromBankValues.map((item, index) =>
                                                <tr key={index}>
                                                    <td onClick={() => navigate(THEME_ONE_ROUTE(item.themeId))}
                                                        className={'hoverEffect'}
                                                    >
                                                        <span style={{
                                                            fontSize: 25,
                                                            fontWeight: 100
                                                        }}>#</span>{item.themeId}
                                                    </td>

                                                    <td onClick={() => navigate(TASK_ONE_ROUTE(item.themeId, item._id))}
                                                        className={'hoverEffect'}>
                                                        <span style={{fontSize: 25, fontWeight: 100}}>#</span>{item._id}
                                                    </td>
                                                    <td onClick={() => navigate(SOLUTIONS_ROUTE(item.themeId, item._id,userId))}
                                                        className={'hoverEffect'}>
                                                        <span style={{fontSize: 25, fontWeight: 100}}>#</span>{item.solutions[0]._id}
                                                    </td>
                                                    <td>{item.database.name}</td>
                                                    <td>
                                                        <div style={{display: "flex", flexDirection: "column"}}>
                                                            <div>
                                                                <Image src={createImage} height={25}
                                                                       style={{marginRight: 5}}/>{convertDate(item.solutions[0].createdAt)}
                                                            </div>
                                                            <div>
                                                                <Image src={updateImage} height={25}
                                                                       style={{marginRight: 5}}/>{convertDate(item.solutions[0].updatedAt)}
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td>{item.description}</td>
                                                    <td>{item.solutions[0].task_solution_score ? +(item.solutions[0].task_solution_score.score.score.toFixed(2)) : '-'}</td>
                                                    <td>
                                                        {item.solutions[0].task_solution_score ? +(item.solutions[0].task_solution_score.score.score.toFixed(2)) : '-'}
                                                        <br/>
                                                        {
                                                            item.solutions[0].task_solution_score
                                                                ? <span
                                                                    style={{fontSize: 10}}>{convertDate(item.solutions[0].task_solution_score.updatedAt)}</span>
                                                                : ''
                                                        }

                                                    </td>
                                                </tr>
                                            )
                                        }

                                        </tbody>
                                    </Table>
                            }
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Созданные задачи</Accordion.Header>
                    <Accordion.Body>
                        <div>

                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Оцененные задачи</Accordion.Header>
                    <Accordion.Body>
                            {
                                rating.usersRating[0].solutionsFromBankValues.length === 0
                                    ? <div>Задач нет</div>
                                    :
                                    <Table bordered responsive>
                                        <thead>
                                        <tr>
                                            <th>Тема</th>
                                            <th>Задача</th>
                                            <th>Решение</th>
                                            <th>БД</th>
                                            <th>Даты</th>
                                            <th>Описание</th>
                                            <th>Баллы</th>
                                            <th>Оценка</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            rating.usersRating[0].solutionsFromBankValues.map((item, index) =>
                                                <tr key={index}>
                                                    <td onClick={() => navigate(THEME_ONE_ROUTE(item.themeId))}
                                                        className={'hoverEffect'}
                                                    >
                                                        <span style={{
                                                            fontSize: 25,
                                                            fontWeight: 100
                                                        }}>#</span>{item.themeId}
                                                    </td>

                                                    <td onClick={() => navigate(TASK_ONE_ROUTE(item.themeId, item._id))}
                                                        className={'hoverEffect'}>
                                                        <span style={{fontSize: 25, fontWeight: 100}}>#</span>{item._id}
                                                    </td>
                                                    <td onClick={() => navigate(SOLUTIONS_ROUTE(item.themeId, item._id,userId))}
                                                        className={'hoverEffect'}>
                                                        <span style={{fontSize: 25, fontWeight: 100}}>#</span>{item.solutions[0]._id}
                                                    </td>
                                                    <td>{item.database.name}</td>
                                                    <td>
                                                        <div style={{display: "flex", flexDirection: "column"}}>
                                                            <div>
                                                                <Image src={createImage} height={25}
                                                                       style={{marginRight: 5}}/>{convertDate(item.solutions[0].createdAt)}
                                                            </div>
                                                            <div>
                                                                <Image src={updateImage} height={25}
                                                                       style={{marginRight: 5}}/>{convertDate(item.solutions[0].updatedAt)}
                                                            </div>
                                                        </div>

                                                    </td>
                                                    <td>{item.description}</td>
                                                    <td>{item.solutions[0].task_solution_score ? +(item.solutions[0].task_solution_score.score.score.toFixed(2)) : '-'}</td>
                                                    <td>
                                                        {item.solutions[0].task_solution_score ? +(item.solutions[0].task_solution_score.score.score.toFixed(2)) : '-'}
                                                        <br/>
                                                        {
                                                            item.solutions[0].task_solution_score
                                                                ? <span
                                                                    style={{fontSize: 10}}>{convertDate(item.solutions[0].task_solution_score.updatedAt)}</span>
                                                                : ''
                                                        }

                                                    </td>
                                                </tr>
                                            )
                                        }

                                        </tbody>
                                    </Table>
                            }

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};
/*

 */
export default UserStat;