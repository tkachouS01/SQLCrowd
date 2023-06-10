import React, {useContext, useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import CodeEditor from "./CodeEdit";
import {Context} from "../../index";
import {createSolution, endSolution, runOneSolution} from "../../httpRequests/solutionAPI";
import {useNavigate, useParams} from "react-router-dom";
import MyTooltip from "../otherComponents/tooltip";
import {SOLUTIONS_ROUTE} from "../../utils/constsPath";
import MyButton from "../basicElements/myButton";
import {observer} from "mobx-react-lite";

const EditSolutionComponent = observer(() => {
    const {themeId, taskId} = useParams()
    let {user} = useContext(Context)
    let {task} = useContext(Context)
    let {solution} = useContext(Context)
    const navigate = useNavigate();
    const [startSolution, setStartSolution] = useState(false)
    const [codeSolution, setCodeSolution] = useState("")
    const [tempRender, setTempRender] = useState(false)
    const [firstRender, setFirstRender] = useState(true)

    useEffect(() => {
        setFirstRender(true)
        if (task.currentTask.myProgress !== 'Не выполнялось') {
            clickGoToTheSolution()
        }
    }, [])
    let clickRunSolution = () => {
        setFirstRender(false)

        runOneSolution(user, task, solution, codeSolution, null, themeId, taskId, solution.oneSolution._id)
            .then((data) => {
                setTempRender(!tempRender)
            })

    }
    let clickEndSolution = () => {
        endSolution(user, solution, null, themeId, taskId, solution.oneSolution._id)
            .then(() => {
            })
            .catch(() => {
            })
    }
    let clickGoToTheSolution = () => {
        createSolution(user, task, solution, null, themeId, taskId)
            .then(() => {
                setCodeSolution(solution.oneSolution.code)

                setStartSolution(true);
            })
    }
    useEffect(() => {
    }, [solution.result.success, tempRender,solution.oneSolution.finished])

    return (
        <>
            {
                (task.currentTask.verified || (task.currentTask.user._id === user.user._id && task.currentTask.database))
                    ?
                    (
                        <div>
                            <div style={{
                                marginBottom: 15,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 15,
                                rowGap: 2,
                                flexWrap: "wrap"
                            }}>
                                <MyButton text={"К решениям других"}
                                          onClick={() => {
                                              navigate(SOLUTIONS_ROUTE(themeId, taskId))
                                          }}
                                />
                                {
                                    !startSolution
                                        ?
                                        (
                                            <MyButton text={"Начать решение"} onClick={clickGoToTheSolution}/>
                                        )
                                        :
                                        (
                                            <>
                                                <MyButton text={"Выполнить"}
                                                          onClick={clickRunSolution}
                                                />
                                                {
                                                    solution.oneSolution.finished
                                                        ? <></>
                                                        :
                                                        <MyButton text={"Завершить решение"}
                                                                  onClick={clickEndSolution}
                                                        />
                                                }

                                                <div>
                                                    {
                                                        !firstRender
                                                            ?
                                                            (
                                                                (solution.result.success)
                                                                    ? (<span style={{
                                                                        background: "#9ACD32",
                                                                        padding: '3px 5px',
                                                                        borderRadius: 10
                                                                    }}>Решение верное</span>)
                                                                    : (<span style={{
                                                                        background: "#FFC0CB",
                                                                        padding: '3px 5px',
                                                                        borderRadius: 10
                                                                    }}>Решение неверное</span>)
                                                            )
                                                            :
                                                            (
                                                                <span style={{
                                                                    background: "lightgray",
                                                                    padding: '3px 5px',
                                                                    fontSize: 12,
                                                                    borderRadius: 10
                                                                }}>Нажмите Выполнить, для проверки решения</span>
                                                            )


                                                    }
                                                </div>
                                            </>
                                        )
                                }
                            </div>
                            <div style={{marginBottom: 15}}>
                                {
                                    startSolution && task.currentTask.database
                                        ? (<CodeEditor codeSolution={codeSolution} setCodeSolution={setCodeSolution}
                                                       readonly={solution.oneSolution.finished}/>)
                                        : (<></>)
                                }
                            </div>

                        </div>

                    )
                    :
                    (
                        <div style={{fontSize: 30}}>
                            Решение задания запрещено, т.к. оно на стадии создания
                        </div>
                    )
            }
        </>

    );
});

export default EditSolutionComponent;