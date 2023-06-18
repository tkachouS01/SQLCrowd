import React, {useContext, useEffect, useState} from 'react';
import QuestionPanel from "./QuestionPanel";
import Question from "./Question";
import MyButton from "../basicElements/myButton";
import addImage from '../../static/add.png'
import add2Image from '../../static/add2.png'
import delete2Image from '../../static/delete2.png'
import {Button, Image} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {addAnswerTest, getInfoAboutTest, getOneTest, makeAvailableTest, updateTest} from "../../httpRequests/testAPI";
import {useParams} from "react-router-dom";


const Quiz = observer(() => {
    const [isLoading, setIsLoading] = useState(false)
    const {test, user} = useContext(Context)
    const {themeId} = useParams();

    const clickAddQuestion = () => {
        const questionsCount = test.allQuestions.length;

        test.setAllQuestions([...test.allQuestions, ''])
        test.setSelectedAnswers([...test.selectedAnswers, []])
        test.setAllAnswers([...test.allAnswers, []])
        test.setCurrentQuestionIndex(questionsCount || 0)
    }
    const clickDeleteQuestion = () => {
        const questionsCount = test.allQuestions.length - 1;

        test.setAllQuestions(test.allQuestions.filter((_, index) => index !== test.currentQuestionIndex))
        test.setSelectedAnswers(test.selectedAnswers.filter((_, index) => index !== test.currentQuestionIndex))
        test.setAllAnswers(test.allAnswers.filter((_, index) => index !== test.currentQuestionIndex))
        if (test.allQuestions.length === 0) test.setCurrentQuestionIndex(null)
        else test.setCurrentQuestionIndex(Math.max(test.currentQuestionIndex >= questionsCount
            ? test.currentQuestionIndex - 1 : test.currentQuestionIndex, 0));
    }
    const clickAddAnswer = () => {
        let temp = test.allAnswers;
        temp[test.currentQuestionIndex].push('');
        test.setAllAnswers(temp);
    }
    const clickSaveTest = () => {
        setIsLoading(true)
        updateTest(user, test, themeId)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }
    const clickMakeAvailableTest = () => {
        makeAvailableTest(user, test, themeId)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }

    const clickSaveUserAnswerTest = () => {
        setIsLoading(true)
        addAnswerTest(user, test, themeId)
            .then((res) => {
                getInfoAboutTest(user, test, themeId)
                    .then(() => {
                        getOneTest(user, test, themeId)
                            .then(() => {
                                setIsLoading(false)
                            })
                            .catch(() => setIsLoading(false))
                    })
                    .catch(() => setIsLoading(false))
            })
            .catch(() => setIsLoading(false))
    }
    useEffect(() => {
    }, [isLoading])
    if (isLoading) return <></>
    return (
        <div style={{display: "flex", flexDirection: "row", userSelect: "none"}}>
            <div style={{width: '15%'}}>
                <div>Навигация по тесту</div>
                <QuestionPanel
                    readResult={(test.testInfo.user_test_answers.length !== 0 && user.user.role === 'USER')}/>
            </div>

            <div style={{width: '85%'}}>
                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 10}}>
                    <Button
                        variant={'light'}
                        disabled={test.allQuestions.length === 0 || test.currentQuestionIndex === 0}
                        onClick={() => test.setCurrentQuestionIndex(test.currentQuestionIndex - 1)}
                    >
                        {"Назад"}
                    </Button>
                    <Button
                        variant={'light'}
                        disabled={test.allQuestions.length === 0 || test.currentQuestionIndex === test.allQuestions.length - 1}
                        onClick={() => test.setCurrentQuestionIndex(test.currentQuestionIndex + 1)}
                    >
                        {"Вперед"}
                    </Button>
                    {
                        user.user.role === 'USER' && test.testInfo.user_test_answers.length === 0
                            ?
                            <MyButton
                                text={`Завершить тестирование`}
                                onClick={clickSaveUserAnswerTest}
                            />
                            : <></>

                    }

                </div>
                {
                    user.user.role === 'ADMIN'
                        ?
                        (
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 20,
                                marginTop: 15
                            }}>

                                <div
                                    onClick={clickAddQuestion}
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        background: 'rgba(89,255,0,0.5)',
                                        padding: 5,
                                        borderRadius: 10
                                    }}
                                >
                                    <Image src={add2Image} width={30}/>
                                    <div style={{marginLeft: 10}}>Добавить вопрос</div>
                                </div>
                                <div
                                    onClick={clickDeleteQuestion}
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        background: 'rgba(255,0,0,0.5)',
                                        padding: 5,
                                        borderRadius: 10
                                    }}>
                                    <Image src={delete2Image} width={20}/>
                                    <div style={{marginLeft: 10}}>Удалить вопрос</div>
                                </div>


                                <MyButton
                                    text={`Сохранить тест`}
                                    onClick={clickSaveTest}
                                />
                                <MyButton
                                    text={`Допуск: ${test.testInfo.isAvailable ? 'Да' : 'Нет'}`}
                                    onClick={clickMakeAvailableTest}
                                />
                            </div>
                        )
                        : <></>
                }
                <hr/>
                <Question
                    readResult={(test.testInfo.user_test_answers.length !== 0 && user.user.role === 'USER')}
                />
                <hr/>
                <div style={{display: "flex", flexDirection: "row"}}>
                    {
                        test.allQuestions.length !== 0 && user.user.role === 'ADMIN'
                            ?
                            <div
                                onClick={clickAddAnswer}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    background: 'rgba(89,255,0,0.5)',
                                    padding: 5,
                                    borderRadius: 10
                                }}
                            >
                                <Image src={addImage} width={30}/>
                                <div style={{marginLeft: 10}}>Добавить вариант ответа</div>
                            </div>
                            : <></>

                    }
                </div>
            </div>

        </div>
    );
});

export default Quiz;