import {Col, Container, Image, Row} from "react-bootstrap";
import solvedImage from "../../static/solved.png";
import usersImage from "../../static/users.png";
import timeImage from "../../static/time.png";
import createImage from "../../static/create.png";
import updateImage from "../../static/update.png";
import dbImage from "../../static/db.png";
import authorImage from "../../static/author.png";

import React, {useContext} from "react";
import {convertDate, timeSolution} from "../../utils/utils";
import {Context} from "../../index";
import Avatar from "../otherComponents/avatar";
import MyTooltip from "../otherComponents/tooltip";

const Stat = (({task, fullContent}) => {
    const {user} = useContext(Context)
    console.log(task)
    return (
        <Container style={{display: "flex", flexDirection: "column", gap: 15}}>
            <Row className="d-flex flex-row justify-content-end"
                 style={{
                     background: "white",
                     padding: '15px',
                     borderRadius: 10,
                     whiteSpace: "nowrap",
                     columnGap: 15,
                     rowGap: 5
                 }}>
                <Col>
                    <MyTooltip info={`Количество успешных решений`}>
                        <>
                            <Image style={{height: 15, width: 'auto'}} src={solvedImage}/>
                            <div>{task.solutionCount}</div>
                        </>
                    </MyTooltip>
                </Col>
                <Col>
                    <MyTooltip info={`Количество пользователей начавших решение`}>
                        <>
                            <Image style={{height: 15, width: 'auto'}} src={usersImage}/>
                            <div>{task.userCount}</div>
                        </>
                    </MyTooltip>

                </Col>
                <Col className="blockFlex">
                    <MyTooltip info={`Среднее время решения задачи`}>
                        <>
                            <Image style={{height: 15, width: 'auto'}} src={timeImage}/>
                            <div>
                                {timeSolution(task.averageTime)}
                            </div>
                        </>
                    </MyTooltip>

                </Col>
                <Col className="blockFlex">
                    <MyTooltip info={`Дата создания задачи`}>
                        <>
                            <Image style={{height: 15, width: 'auto'}} src={createImage}/>
                            <div>{convertDate(task.createdAt)}</div>
                        </>
                    </MyTooltip>

                </Col>
                <Col className="blockFlex">
                    <MyTooltip info={"Дата последнего изменения задачи"}>
                        <>
                            <Image style={{height: 15, width: 'auto'}} src={updateImage}/>
                            <div>{convertDate(task.updatedAt)}</div>
                        </>
                    </MyTooltip>

                </Col>
                <Col className="blockFlex">
                    <MyTooltip info={"База данных для решения"}>
                        <>
                            <Image style={{height: 15, width: 'auto'}} src={dbImage}/>
                            <div>
                                {

                                    task.database ? `${task.database.name} [id${task.database._id}]` :
                                        <span style={{opacity: 0.5, fontWeight: 100}}>{'Не выбрана'}</span>

                                }

                            </div>
                        </>
                    </MyTooltip>

                </Col>
            </Row>
            <Row style={{background: "white", padding: 15, borderRadius: 10}}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <MyTooltip info={"Номер задачи"}>
                        <>
                            <span style={{
                                fontWeight: "100",
                                fontFamily: 'Arial',
                                background: 'lightgray',
                                padding: 5,
                                borderRadius: 10,
                                marginRight: 10
                            }}>#{task._id}</span>
                        </>
                    </MyTooltip>

                    <MyTooltip info={"Условие задачи"}>
                        < >
                            <div style={{
                                fontWeight: "700",
                                fontFamily: 'Arial',
                                color: 'gray',
                                width: "100%"
                            }}>
                                {
                                    task.description ?
                                        (
                                            fullContent
                                                ?
                                                (
                                                    <div style={{wordWrap: "break-word", paddingRight: 30}}>
                                                        {task.description}
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        paddingRight: 30
                                                    }}>
                                                        {task.description}
                                                    </div>
                                                )
                                        )
                                        :
                                        (
                                            <div style={{opacity: 0.5, fontWeight: 100}}>{'Не указано'}</div>
                                        )


                                }


                            </div>
                        </>
                    </MyTooltip>

                </div>


                <div style={{
                    fontSize: 12,
                    marginTop: 15,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                    rowGap: 5,
                    columnGap: 15
                }}>

                    <MyTooltip info={"Автор задачи"}>
                        <>
                            <div style={{
                                display: "inline-flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <Avatar width={25} _id={task.user._id}/>
                                <span style={{marginLeft: 5}}>{task.user.nickname} [id{task.user._id}]</span>
                                <Image style={{height: 10, width: 'auto', marginLeft: 2}} src={authorImage}/>
                            </div>
                        </>
                    </MyTooltip>

                    {
                        task.user.nickname === user.user.nickname
                            ?
                            (
                                <div style={{
                                    background: "lightgreen",
                                    padding: '2px 5px',
                                    borderRadius: 8,
                                    display: "inline-flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <span>Ваша задача</span>
                                </div>
                            )
                            : (<></>)


                    }

                    <div>
                        {
                            task.myProgress === "Решено"
                                ?
                                (<div style={{
                                    background: "lightgreen",
                                    padding: '2px 5px',
                                    borderRadius: 8,
                                }}>{task.myProgress}</div>)
                                : (<></>)
                        }
                        {
                            task.myProgress === "Выполняется"
                                ?
                                (<div style={{
                                    background: "lightyellow",
                                    padding: '2px 5px',
                                    borderRadius: 8,
                                }}>{task.myProgress}</div>)
                                : (<></>)
                        }
                        {
                            task.myProgress === "Не выполнялось"
                                ?
                                (<div style={{
                                    background: "lightgray",
                                    padding: '2px 5px',
                                    borderRadius: 8,
                                }}>{task.myProgress}</div>)
                                : (<></>)
                        }
                    </div>
                    {
                        task.verified
                            ? (<></>)
                            :
                            (
                                <div style={{
                                    background: "red",
                                    padding: '2px 5px',
                                    borderRadius: 8,
                                }}>
                                    Задание создается
                                </div>
                            )
                    }

                </div>
            </Row>
        </Container>
    )
});
export default Stat
