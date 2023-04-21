import {Card, Col, Container, Image, Row} from "react-bootstrap";
import solvedImage from "../../static/solved.png";
import usersImage from "../../static/users.png";
import timeImage from "../../static/time.png";
import createImage from "../../static/create.png";
import updateImage from "../../static/update.png";
import dbImage from "../../static/db.png";
import authorImage from "../../static/author.png";

import React, {useContext, useEffect} from "react";
import {convertDate, timeSolution} from "../../utils/utils";
import {Context} from "../../index";

const Stat = (({task, fullContent}) => {
    const {user} = useContext(Context)

    return (
        <Container style={{display: "flex", flexDirection: "column", gap: 15}}>
            <Row className="d-flex flex-row justify-content-end gap-2"
                 style={{background: "white", padding: 15, borderRadius: 10, whiteSpace: "nowrap"}}>
                <Col className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={solvedImage}/>
                    <div>{task.solutionCount}</div>
                </Col>
                <Col className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={usersImage}/>
                    <div>{task.userCount}</div>
                </Col>
                <Col className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={timeImage}/>
                    <div>
                        {timeSolution(task.averageTime)}
                    </div>
                </Col>
                <Col className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={createImage}/>
                    <div>{convertDate(task.createdAt)}</div>
                </Col>
                <Col className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={updateImage}/>
                    <div>{convertDate(task.updatedAt)}</div>
                </Col>
                <Col className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={dbImage}/>
                    <div>
                        {

                            task.database ? `${task.database.name} [id${task.database.id}]` :
                                <span style={{opacity: 0.5, fontWeight: 100}}>{'Не выбрана'}</span>

                        }

                    </div>
                </Col>
            </Row>
            <Row style={{background: "white", padding: 15, borderRadius: 10}}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

                    <span style={{
                        fontWeight: "100",
                        fontFamily: 'Arial',
                        background: 'lightgray',
                        padding: 5,
                        borderRadius: 10,
                        marginRight: 10
                    }}>#{task.id}</span>

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
                </div>



                <div style={{
                    fontSize: 12,
                    marginTop: 15,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 15
                }}>
                    <div style={{
                        display: "inline-flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Image src={`https://picsum.photos/200?random=${task.user.id}`}
                               style={{width: 25, height: 25, borderRadius: '50%', marginRight: 5}}/>
                        <span style={{marginLeft: 5}}>{task.user.nickname} [id{task.user.id}]</span>
                        <Image style={{height: 10, width: 'auto', marginLeft:2}} src={authorImage}/>
                    </div>
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
