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

const SolutionsPage = observer(() => {
    const {user} = useContext(Context);
    const {task} = useContext(Context);
    const {solution} = useContext(Context);
    const [requestCompleted, setRequestCompleted] = useState(false)

    const navigate = useNavigate()
    const {id} = useParams();
    const [newComments, setNewComments] = useState({});

    useEffect(() => {
        getOneTask(user, task, id)
            .then(() => {
                getSolutions(user, task, solution, id, navigate)
                    .then(() => {
                        setRequestCompleted(true)
                    })
            })

    }, [])
    const sendCommentToServer = (solutionId) => {
        createComment(user, task, solution, solutionId, newComments[solutionId], navigate)
            .then(() => {
                setRequestCompleted(true);
                setNewComments({...newComments, [solutionId]: ""})
            })
    }
    const clickLike = (solutionId) => {
        like(user,task,solution,solutionId).then(() => setRequestCompleted(true))
    }
    if (!requestCompleted) {
        return (<></>)
    }



    return (

        <Container className="col-md-9" style={{display: "flex", flexDirection: "column", gap: 15, width: "100%"}}>
            <Stat task={task.currentTask} fullContent={true}/>
            <div style={{textAlign: "end"}}>Для задачи было создано {solution.allSolutions.length} решений</div>
            <Container style={{
                background: "white",
                borderRadius: 10,
                padding: 15,
                display: "flex",
                flexDirection: "column",
                gap: 15
            }}>
                {
                    solution.allSolutions.length===0
                        ?
                        <div style={{textAlign: "center"}}>
                            Решений еще нет
                        </div>
                        :
                        <></>
                }
                {

                    solution.allSolutions.map(solutionOne =>
                        (
                            <Card
                                key={solutionOne._id}
                                className="d-flex flex-row justify-content-between flex-column"
                            >
                                <Container style={{padding: '10px 20px 0'}}>
                                    <div>

                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 15,
                                            flexWrap: "wrap"
                                        }}>
                                            <span style={{
                                                background: "lightgray",
                                                padding: '5px 10px'
                                            }}>{solutionOne._id}</span>
                                            <span>Попытки: {solutionOne.attempts}</span>
                                            {solutionOne.user._id === user.user._id
                                                ? (<span style={{
                                                    background: "lightblue",
                                                    padding: '3px 10px',
                                                    borderRadius: 10
                                                }}>Ваше решение</span>)
                                                : <></>}
                                            {solutionOne.is_author
                                                ? (<span style={{
                                                    background: "lightyellow",
                                                    padding: '3px 10px',
                                                    borderRadius: 10
                                                }}>Решение автора задачи</span>)
                                                : <></>}
                                        </div>

                                    </div>
                                    <div
                                        style={{
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
                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>


                                                <Avatar width={25} _id={solutionOne.user._id}/>

                                                {solutionOne.user.nickname} [{solutionOne.user._id}]
                                            </div>
                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                <Image src={createImage} style={{height: 15, marginRight: 5}}/>
                                                <span>{convertDate(solutionOne.createdAt)}</span>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                <Image src={updateImage} style={{height: 15, marginRight: 5}}/>
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
                                            onClick={()=>{clickLike(solutionOne._id)}}

                                        >
                                            <span style={{marginRight: 15}}>{solutionOne.like.likeCount}</span>

                                            {
                                                solutionOne.like.isLiked
                                                ?
                                                    (
                                                        <Image
                                                            src={likeImage}
                                                            style={{height: 25, width: 'auto', opacity: 0.8}}
                                                        />
                                                    )
                                                    :
                                                    (
                                                        <Image
                                                            src={likeImage}
                                                            style={{height: 25, width: 'auto', opacity: 0.2}}
                                                        />
                                                    )
                                            }

                                        </div>


                                    </div>
                                </Container>
                                <hr/>
                                <div style={{margin: '10px 30px'}}>
                                    {
                                        solutionOne.solution_comments.length
                                            ?
                                            (
                                                <div style={{display: "flex", flexDirection: "column"}}>
                                                    {
                                                        solutionOne.solution_comments.map(comment => (
                                                            <div key={comment._id} style={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                padding: '10px 0'
                                                            }}>
                                                                <Avatar width={40} _id={comment.user._id}/>

                                                                <div style={{marginLeft: 15}}>
                                                                    <div
                                                                        style={{fontWeight: 700}}>{comment.user.nickname} [{comment.user._id}]
                                                                    </div>
                                                                    <div
                                                                        style={{padding: '5px 0'}}>{comment.content}</div>
                                                                    <div
                                                                        style={{fontSize: 10}}>{convertDate(comment.createdAt)}</div>
                                                                </div>

                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                            :
                                            (
                                                <div style={{marginBottom: 20, textAlign: "center"}}>Комментариев
                                                    нет</div>
                                            )
                                    }
                                    {
                                        <Form style={{display: "flex", flexDirection: "row", alignItems: "center"}}>

                                            <Avatar width={40} _id={user.user._id}/>

                                            <Form.Control
                                                type="text"
                                                placeholder="Написать комментарий...."
                                                value={newComments[solutionOne._id] || ""}
                                                onChange={(e) => {
                                                    setNewComments({...newComments, [solutionOne._id]: e.target.value});
                                                }}
                                            />
                                            <Image
                                                src={sendImage}
                                                style={{height: 20, width: 'auto', marginLeft: 10, cursor: "pointer"}}
                                                onClick={() => sendCommentToServer(solutionOne._id)}
                                            />
                                        </Form>

                                    }

                                </div>
                            </Card>
                        ))
                }
            </Container>


        </Container>

    )
})
export default SolutionsPage;