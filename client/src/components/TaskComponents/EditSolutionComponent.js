import React, {useContext, useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import CodeEditor from "./CodeEdit";
import {Context} from "../../index";
import {createSolution, updateOneSolution} from "../../httpRequests/solutionApi";
import {useNavigate} from "react-router-dom";

const EditSolutionComponent = () => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)
    let {solution} = useContext(Context)
    const navigate = useNavigate();
    const [startSolution, setStartSolution] = useState(false)
    const [requestCompleted, setRequestCompleted] = useState(false)
    const [codeSolution, setCodeSolution] = useState("")
    const [tempRender, setTempRender] = useState(false)
    const [firstRender, setFirstRender] = useState(true)

useEffect(()=>{setFirstRender(true)},[])
    let clickStartSolution = () => {
        setFirstRender(false)
        updateOneSolution(user, task, solution, codeSolution)
            .then(() => {

                setTempRender(!tempRender)
            })
    }
    let clickGoToTheSolution = () => {
        createSolution(user, task, solution, navigate)
            .then(() => {
                setCodeSolution(solution.solution.code)
                setStartSolution(true);
            })
    }
    useEffect(() => { }, [solution.result.success, tempRender])
    return (
        <>
            {
                (task.task.info.verified || (task.task.info.user.id === user.user.id && task.task.info.database))
                    ?
                    (
                        <Container style={{background: "white", borderRadius: 10, padding: 15}}>

                            {
                                !startSolution
                                    ?
                                    (
                                        <div style={{display: "flex", flexDirection: "row", gap: 15}}>
                                            <Button onClick={clickGoToTheSolution}>К решению</Button>
                                        </div>

                                    )
                                    :
                                    (
                                        <div style={{marginBottom: 15, display: "flex", flexDirection:"row", alignItems:"center", columnGap: 15,rowGap: 2, flexWrap: "wrap"}}>
                                            <Button onClick={clickStartSolution}>Выполнить</Button>
                                            <Button onClick={()=>{navigate(`/tasks/${task.selectedTask}/solutions`)}}>К решениям других</Button>
                                            <div>
                                                {
                                                    !firstRender
                                                        ?
                                                        (
                                                            (solution.result.success && user.errorMessage.status==200 )
                                                                ? (<span style={{background: "#9ACD32", padding: '3px 5px', borderRadius: 10}}>Решение верное</span>)
                                                                : (<span style={{background: "#FFC0CB", padding: '3px 5px', borderRadius: 10}}>Решение неверное</span>)
                                                        )
                                                    :
                                                        (
                                                            <span style={{background: "lightgray", padding: '3px 5px',fontSize: 12, borderRadius: 10}}>Нажмите Выполнить, для проверки решения</span>
                                                        )



                                                }
                                            </div>
                                        </div>
                                    )
                            }
                            {
                                startSolution && task.task.info.database
                                    ? (<CodeEditor codeSolution={codeSolution} setCodeSolution={setCodeSolution} readonly={false}/>)
                                    : (<></>)
                            }
                        </Container>
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
};

export default EditSolutionComponent;