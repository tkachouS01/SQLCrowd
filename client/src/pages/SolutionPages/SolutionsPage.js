import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {createComment, getSolutions, like} from "../../httpRequests/solutionAPI";
import {Context} from "../../index";
import {Card, Container, Form, Image} from "react-bootstrap";
import Stat from "../../components/TaskComponents/stat";
import {getOneTask} from "../../httpRequests/taskAPI";
import CodeEditor from "../../components/TaskComponents/CodeEdit";
import {convertDate} from "../../utils/utils";
import sendImage from '../../static/send.png'
import createImage from '../../static/create.png'
import updateImage from '../../static/update.png'
import likeImage from '../../static/like.png'
import {observer} from "mobx-react-lite";
import Avatar from "../../components/otherComponents/avatar";
import UserImgLink from "../../components/basicElements/userImgLink";
import {TASK_ONE_ROUTE, USER_ONE_ROUTE} from "../../utils/constsPath";
import StarRating from "../../components/SolutionComponents/StarRating";
import wordInput from "../../components/basicElements/WordInput";

const SolutionsPage = observer(() => {
    const navigate = useNavigate()
    const {user} = useContext(Context);
    const {task} = useContext(Context);
    const {solution} = useContext(Context);
    const [requestCompleted, setRequestCompleted] = useState(false)

    const {themeId, taskId} = useParams();

    const [newComments, setNewComments] = useState({});

    useEffect(() => {
        getOneTask(user, task, themeId, taskId)
            .then(() => {
                getSolutions(user, task, solution, null, themeId, taskId)
                    .then((data) => {
                        if (!data) {
                            navigate(TASK_ONE_ROUTE(themeId, taskId))
                        }
                        setRequestCompleted(true)
                    })
                    .catch(() => {

                    })
            })

    }, [])
    const sendCommentToServer = (solutionId) => {

        createComment(user, task, solution, newComments[solutionId], null, themeId, taskId, solutionId)
            .then(() => {
                setRequestCompleted(true);
                setNewComments({...newComments, [solutionId]: ""})
            })
    }
    const clickLike = (solutionId) => {
        like(user, task, solution, null, themeId, solutionId).then(() => setRequestCompleted(true))
    }
    if (!requestCompleted) {
        return (<></>)
    }

    return (
        <div className="col-md-9"
             style={{display: "flex", flexDirection: "column", gap: 15, width: "100%"}}
        >
            <Stat task={task.currentTask}
                  fullContent={true}
            />
            <div style={{textAlign: "end"}}>
                Для задачи было создано {solution.allSolutions.length} решений
            </div>
            <div style={{
                background: "white",
                borderRadius: 10,
                padding: 15,
                display: "flex",
                flexDirection: "column",
                gap: 15
            }}>
                {
                    solution.allSolutions.length === 0
                        ? <div style={{textAlign: "center"}}> Решений еще нет </div>
                        : <></>
                }
                {

                    solution.allSolutions.map(solutionOne =>
                        <Card
                            key={solutionOne._id}
                            className="d-flex flex-row justify-content-between flex-column"
                        >
                            <div style={{padding: '10px 20px 0'}}>
                                <div>

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 15,
                                        flexWrap: "wrap"
                                    }}>
                                        <span style={{background: "lightgray", padding: '5px 10px'}}>
                                            {solutionOne._id}
                                        </span>
                                        <span>
                                            Попытки: {solutionOne.attempts}
                                        </span>
                                        {
                                            solutionOne.user._id === user.user._id
                                                ?
                                                <span style={{
                                                    background: "lightblue",
                                                    padding: '3px 10px',
                                                    borderRadius: 10
                                                }}>
                                                    Ваше решение
                                                </span>
                                                : <></>
                                        }
                                        {
                                            solutionOne.isAuthor
                                                ?
                                                <span style={{
                                                    background: "lightyellow",
                                                    padding: '3px 10px',
                                                    borderRadius: 10
                                                }}>
                                                    Решение автора задачи
                                                </span>
                                                : <></>
                                        }
                                    </div>

                                </div>
                                <div style={{
                                    margin: '20px 0 10px',
                                    border: `3px solid ${solutionOne.verified ? "lightgreen" : "red"}`
                                }}>
                                    <CodeEditor
                                        codeSolution={solutionOne.code}
                                        setCodeSolution={null}
                                        readonly={true}
                                    />
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: 15
                                    }}>
                                        <UserImgLink _id={solutionOne.user._id}
                                                     nickname={solutionOne.user.nickname}
                                                     role={solutionOne.user.role}
                                        />

                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <Image src={createImage}
                                                   style={{height: 15, marginRight: 5}}
                                            />
                                            <span>{convertDate(solutionOne.createdAt)}</span>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <Image src={updateImage}
                                                   style={{height: 15, marginRight: 5}}
                                            />
                                            <span>{convertDate(solutionOne.updatedAt)}</span>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            alignSelf: "end",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: '5px 10px',
                                            background: "lightgray",
                                            borderRadius: 15
                                        }}
                                        onClick={() => {
                                            clickLike(solutionOne._id)
                                        }}
                                    >
                                        <span style={{marginRight: 15}}>{solutionOne.like.likeCount}</span>


                                        {
                                            solutionOne.like.isLiked
                                                ?
                                                <Image src={likeImage}
                                                       style={{height: 25, width: 'auto', opacity: 0.8}}
                                                />
                                                :
                                                <Image src={likeImage}
                                                       style={{height: 25, width: 'auto', opacity: 0.2}}
                                                />

                                        }

                                    </div>


                                </div>
                            </div>
                            <hr/>
                            <div style={{margin: '10px 30px'}}>
                                {
                                    solutionOne.solution_comments.length
                                        ?
                                        <div style={{display: "flex", flexDirection: "column"}}>
                                            {
                                                solutionOne.solution_comments.map(comment =>
                                                    <div key={comment._id}>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            padding: '10px 0',
                                                        }}>
                                                            <div
                                                                onClick={() => navigate(USER_ONE_ROUTE(comment.user._id))}
                                                                style={{cursor: "pointer"}}
                                                            >
                                                                <Avatar width={40} _id={comment.user._id}/>
                                                            </div>


                                                            <div style={{paddingLeft: 15, flexGrow: 1}}>
                                                                <div
                                                                    onClick={() => navigate(USER_ONE_ROUTE(comment.user._id))}
                                                                    style={{fontWeight: 700, cursor: "pointer"}}
                                                                >
                                                                    {comment.user.nickname} [{comment.user._id}]
                                                                </div>
                                                                <span
                                                                    style={{
                                                                        padding: '5px 0',
                                                                        overflowWrap: "break-word",
                                                                       wordBreak: "break-all",
                                                                    }}
                                                                >
                                                                    {comment.content}
                                                                </span>
                                                                <div
                                                                    style={{fontSize: 10}}
                                                                >
                                                                    {convertDate(comment.createdAt)}
                                                                </div>

                                                            </div>
                                                            {
                                                                comment.task_rating !== null && 'rating' in comment.task_rating
                                                                    ?
                                                                    <div style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "end",
                                                                        minWidth: '200px'
                                                                    }}>
                                                                        <div>
                                                                            <StarRating readonly={true}
                                                                                        initialStars={comment.task_rating.rating}/>
                                                                        </div>

                                                                        <div style={{fontSize: 10, marginTop: 5}}> {

                                                                            comment.task_rating.verified
                                                                                ?
                                                                                <span
                                                                                    className={'main-color-green'}>
                                                                                    Оценка адекватная
                                                                                </span>
                                                                                :
                                                                                comment.task_rating.verified === null
                                                                                    ?
                                                                                    <span
                                                                                        className={'main-color-yellow'}>
                                                                                        Оценка не проходила проверку
                                                                                    </span>
                                                                                    :
                                                                                    <span
                                                                                        className={'main-color-red'}>
                                                                                        Оценка является выбросом
                                                                                    </span>

                                                                        }
                                                                        </div>

                                                                    </div>
                                                                    : <></>
                                                            }
                                                        </div>
                                                        <hr/>
                                                    </div>
                                                )
                                            }
                                        </div>

                                        :
                                        <div
                                            style={{marginBottom: 20, textAlign: "center"}}
                                        >
                                            Комментариев нет
                                        </div>
                                }
                                {
                                    <Form style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <div
                                            onClick={() => navigate(USER_ONE_ROUTE(user.user._id))}
                                            style={{cursor: "pointer", marginRight: 10}}
                                        >
                                            <Avatar width={40} _id={user.user._id}/>
                                        </div>


                                        <Form.Control
                                            type="text"
                                            placeholder="Написать комментарий...."
                                            value={newComments[solutionOne._id] || ""}
                                            onChange={(e) => {
                                                setNewComments({...newComments, [solutionOne._id]: e.target.value});
                                            }}
                                        />
                                        <div
                                            style={{cursor: "pointer",}}
                                            onClick={() => sendCommentToServer(solutionOne._id)}
                                        >
                                            <Image
                                                src={sendImage}
                                                style={{height: 30, width: 'auto', marginLeft: 10, cursor: "none"}}
                                            />
                                        </div>


                                    </Form>

                                }

                            </div>
                        </Card>
                    )
                }
            </div>
        </div>

    )
})
export default SolutionsPage;