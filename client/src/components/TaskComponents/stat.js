import {Image} from "react-bootstrap";
import solvedImage from "../../static/solved.png";
import usersImage from "../../static/users.png";
import timeImage from "../../static/time.png";
import createImage from "../../static/create.png";
import updateImage from "../../static/update.png";
import dbImage from "../../static/db.png";
import React, {useContext} from "react";
import {convertDate, timeSolution} from "../../utils/utils";
import {Context} from "../../index";
import UserImgLink from "../basicElements/userImgLink";
import TaskStatusAuthor from "../basicElements/taskStatusAuthor";

const Stat = (({task}) => {
    const {user} = useContext(Context)

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 15}}>
            <div className="d-flex flex-row justify-content-end"
                 style={{
                     whiteSpace: "nowrap",
                     columnGap: 15,
                     rowGap: 5
                 }}>
                <div className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={solvedImage}/>
                    <div>{task.solutionCount}</div>
                </div>
                <div className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={usersImage}/>
                    <div>{task.userCount}</div>
                </div>
                <div className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={timeImage}/>
                    <div> {timeSolution(task.averageTime)} </div>
                </div>
                <div className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={createImage}/>
                    <div>{convertDate(task.createdAt)}</div>
                </div>
                <div className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={updateImage}/>
                    <div>{convertDate(task.updatedAt)}</div>
                </div>
                <div className="blockFlex">
                    <Image style={{height: 15, width: 'auto'}} src={dbImage}/>
                    <div>
                        {
                            task.database ? `${task.database.name} [id${task.database._id}]` :
                                <span style={{opacity: 0.5, fontWeight: 100}}>{'Не выбрана'}</span>
                        }
                    </div>
                </div>
            </div>
            <div>
                <div style={{marginBottom: 15}}>
                    <TaskStatusAuthor/>
                </div>

                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <span style={{
                        fontWeight: "100",
                        fontFamily: 'Arial',
                        background: 'lightgray',
                        padding: 5,
                        borderRadius: 10,
                        marginRight: 10
                    }}>#{task._id}</span>

                    <div style={{
                        fontWeight: "700",
                        fontFamily: 'Arial',
                        color: 'gray',
                        maxWidth: '100%'
                    }}>
                        {
                            task.description
                                ?
                                <div style={{
                                    overflowWrap: "break-word",
                                    wordBreak: "break-all", paddingRight: 30
                                }}>
                                    {task.description}
                                </div>
                                :
                                <div style={{opacity: 0.5, fontWeight: 100}}>{'Не указано'}</div>
                        }
                    </div>
                </div>
                {
                    task.sqlCommands.length > 0
                        ?
                        <div style={{
                            marginTop: 15,
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            columnGap: 10
                        }}>
                            {
                                task.sqlCommands.map((item, index) =>
                                    <span key={index} style={{padding: '5px 10px', borderRadius: 10, fontSize: 10}}
                                          className={'main-color-blue'}>{item}</span>
                                )
                            }
                        </div>
                        : <></>
                }


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
                    <UserImgLink _id={task.user._id} role={task.user.role} nickname={task.user.nickname}/>
                    {
                        task.user._id === user.user._id
                            ?
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
                            : <></>
                    }
                    <div>
                        {
                            task.myProgress === "Решено"
                                ?
                                <div
                                    className={'main-color-green'}
                                    style={{padding: '2px 5px', borderRadius: 8}}
                                >
                                    {task.myProgress}
                                </div>
                                : <></>
                        }
                        {
                            task.myProgress === "Решение не верное"
                                ?
                                <div
                                    className={'main-color-red'}
                                    style={{padding: '2px 5px', borderRadius: 8}}
                                >
                                    {task.myProgress}
                                </div>
                                : <></>
                        }
                        {
                            task.myProgress === "Не выполнялось"
                                ?
                                <div
                                    className={'main-color-yellow'}
                                    style={{padding: '2px 5px', borderRadius: 8}}
                                >
                                    {task.myProgress}
                                </div>
                                : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
});
export default Stat