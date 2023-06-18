import React, {useContext} from 'react';
import {Context} from "../../index";
import NoText from "../basicElements/noText";
import {observer} from "mobx-react-lite";

const QuestionPanel = observer(({readResult}) => {
    const {test} = useContext(Context)

    return (
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 5}}>
            {
                test.allQuestions.length === 0
                    ?
                    <NoText text={"Вопросов нет"}/>
                    :
                    <>
                        {test.allQuestions.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    userSelect: "none",
                                    cursor: "pointer",
                                    display: "inline-block",
                                    border: '1px solid black',
                                    borderRadius: 5,
                                    backgroundColor: index === test.currentQuestionIndex ? 'rgba(1,1,1,0.1)' : 'transparent'
                                }}
                                onClick={() => test.setCurrentQuestionIndex(index)}
                            >
                                <div style={{width: 30, textAlign: "center"}}>{index + 1}</div>
                                <div
                                    style={{
                                        height: 10,
                                        opacity: 0.5,
                                        background: test.selectedAnswers[index].length !== 0 && !readResult
                                            ? 'gray'
                                            : readResult
                                                ? JSON.stringify(test.correctAnswers[index]) === JSON.stringify(test.selectedAnswers[index])
                                                    ? "rgba(89,255,0,0.5)"
                                                    : "rgba(255,0,0,0.5)"
                                                : 'transparent'
                                    }}
                                >

                                </div>
                            </div>
                        ))}
                    </>
            }

        </div>
    );
});

export default QuestionPanel;