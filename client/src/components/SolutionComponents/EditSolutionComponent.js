import React, {useContext, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import CodeEditor from "../TaskComponents/CodeEdit";
import {Context} from "../../index";
import {createSolution} from "../../httpRequests/solutionAPI";
import {useNavigate} from "react-router-dom";

const EditSolutionComponent = () => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)
    let {solution} = useContext(Context)
    const navigate = useNavigate();
    const [startSolution, setStartSolution] = useState(false)

    const [codeSolution, setCodeSolution] = useState("")

    let clickStartSolution = () => {

    }
    let clickGoToTheSolution = () => {
        if (!startSolution) {
            createSolution(user, task, solution, navigate)
                .then(() => {
                    setCodeSolution(solution.solution.code)
                    setStartSolution(true);
                })

        }
    }
    return (
        <>
            {
                (task.currentTask.verified || (task.currentTask.user._id === user.user._id && task.currentTask.database))
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
                                        <div style={{marginBottom: 15}}>
                                            <Button onClick={clickStartSolution}>Выполнить</Button>
                                        </div>
                                    )
                            }
                            {
                                startSolution && task.currentTask.database
                                    ? (<CodeEditor codeSolution={codeSolution} setCodeSolution={setCodeSolution}/>)
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