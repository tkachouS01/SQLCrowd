import React, {useContext} from 'react';
import deleteImage from '../../static/delete.png'
import {Form, Image} from "react-bootstrap";
import {Context} from "../../index";
import NoText from "../basicElements/noText";
import {observer} from "mobx-react-lite";
import TextareaAutosize from 'react-textarea-autosize';

const Question = observer(({readResult}) => {

    const {test, user} = useContext(Context)

    const handleAnswerChange = (curIndex, value, bool) => {
        if (!value) return;

        test.setSelectedAnswers(
            test.selectedAnswers.map((item, index) => {

                    if (index === test.currentQuestionIndex) {
                        if (item.includes(value)) {
                            item.splice(item.indexOf(value), 1)
                        } else {
                            item.push(value);
                        }
                        return item
                    } else {
                        return item
                    }

                }
            )
        );
    };

    const handleAnswerDelete = (index) => {
        const temp = test.allAnswers[test.currentQuestionIndex][index]
        test.setAllAnswers(test.allAnswers.map((item1, index1) =>
            item1.filter((item2, index2) => !(index2 === index && index1 === test.currentQuestionIndex))))
        test.setSelectedAnswers(test.selectedAnswers.map((item1, index1) =>
            item1.filter((item2, index2) => !(item2 === temp && index1 === test.currentQuestionIndex))))
    };
    const updateAnswer = (value, index) => {

        let temp11 = test.selectedAnswers;
        temp11[test.currentQuestionIndex][test.selectedAnswers[test.currentQuestionIndex]
            .indexOf(test.allAnswers[test.currentQuestionIndex][index])] = value

        test.setSelectedAnswers(temp11)
        let temp = test.allAnswers.slice();
        temp[test.currentQuestionIndex][index] = value;
        test.setAllAnswers(temp);
    }


    return (
        <div>
            {
                test.allQuestions.length === 0
                    ?
                    <NoText text={`Вопросов нет, создайте его`}/>
                    :
                    <>
                        <div style={{marginTop: 15, opacity: 0.5}}>Вопрос #{test.currentQuestionIndex + 1}</div>
                        <TextareaAutosize
                            readOnly={user.user.role === 'USER'}
                            style={{
                                fontSize: 25,
                                resize: "none",
                                width: '100%',
                                fontWeight: 500,
                                border: "none",
                                padding: '0 10px',
                                background: "transparent"
                            }}
                            placeholder={'Введите здесь ваш вопрос'}
                            value={test.allQuestions[test.currentQuestionIndex]}
                            onChange={(e) => test.setAllQuestions(test.allQuestions.map((item, index) =>
                                test.currentQuestionIndex === index ? e.target.value : item))}
                        />
                        <div style={{display: "flex", flexDirection: "column", background: "white", borderRadius: 15}}>
                            {
                                !test.allAnswers[test.currentQuestionIndex]
                                    ?
                                    <NoText text={`Вопрос не имеет вариантов ответов`}/>
                                    :
                                    <div style={{display: "flex", flexDirection: "column", gap: 5, padding: '10px 0'}}>
                                        {test.allAnswers[test.currentQuestionIndex].map((answer, index) => (

                                            <div key={index}
                                                 style={{
                                                     display: "flex",
                                                     flexDirection: "row",
                                                     justifyContent: "space-between",
                                                     padding: '10px',
                                                     backgroundColor: !readResult
                                                         ? "transparent"
                                                         : test.correctAnswers[test.currentQuestionIndex].includes(answer)
                                                             ? test.selectedAnswers[test.currentQuestionIndex].includes(answer)
                                                                 ? "rgba(89,255,0,0.2)"
                                                                 : "rgba(255,0,0,0.2)"
                                                             : test.selectedAnswers[test.currentQuestionIndex].includes(answer)
                                                                 ? "rgba(255,0,0,0.2)"
                                                                 : "transparent"

                                                 }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 10,
                                                    flexGrow: 1
                                                }}>

                                                    <Form.Group controlId={`check${index}`} style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 15,
                                                        flexGrow: 1
                                                    }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={test.selectedAnswers[test.currentQuestionIndex].includes(answer)}
                                                            onChange={(e) => handleAnswerChange(index, answer, e.target.value)}
                                                            style={{pointerEvents: readResult ? 'none' : 'auto'}}
                                                            disabled={readResult}
                                                        />
                                                        <TextareaAutosize
                                                            readOnly={user.user.role === 'USER'}
                                                            value={answer}
                                                            placeholder={'Нажмите, для редактирования . . .'}
                                                            onChange={(e) => updateAnswer(e.target.value, index)}
                                                            style={{
                                                                resize: "none",
                                                                flexGrow: 1,
                                                                border: "none",
                                                                background: "none"
                                                            }}
                                                        />
                                                    </Form.Group>


                                                </div>
                                                {
                                                    user.user.role === 'ADMIN'
                                                        ?
                                                        <div
                                                            onClick={() => handleAnswerDelete(index)}
                                                            style={{
                                                                cursor: "pointer",
                                                                background: 'rgba(255,0,0,0.5)',
                                                                width: 30,
                                                                height: 30,
                                                                borderRadius: '50%',
                                                                marginLeft: 15,
                                                                alignSelf: "center"
                                                            }}
                                                        >
                                                            <Image src={deleteImage} width={30}/>
                                                        </div>
                                                        : <></>
                                                }


                                            </div>

                                        ))}
                                    </div>
                            }

                        </div>
                    </>
            }

        </div>
    );
});

export default Question;
