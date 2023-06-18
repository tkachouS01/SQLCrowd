import React, {useContext} from 'react';
import NoText from "../noText";
import {convertDate} from "../../../utils/utils";
import UserImgLink from "../userImgLink";
import Banner from "../banner";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";

const TestBanner = observer(() => {
    const {test} = useContext(Context)
    return (
        <Banner>
            <>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 5
                }}>
                    <div style={{width: '70%'}}>
                        <div style={{fontSize: 25, fontWeight: 500, textTransform: "uppercase"}}>Тестирование</div>
                        <div style={{fontWeight: 100, opacity: 0.7}}>
                            Тестирование к теме <span style={{fontSize: 25}}>{test.testInfo.theme.name === '' ?
                            <NoText text={"Название темы не введено"}/> : test.testInfo.theme.name}</span> состоит из
                            <span style={{fontWeight: 500}}> {test.testInfo.questionsCount || 0} вопросов </span>
                            с возможностью множественного выбора.
                            За один правильный ответ вы можете получить
                            <span
                                style={{fontWeight: 500}}> {test.testInfo.theme.difficulty_level_of_theme.testSolution || 0} баллов</span>.
                            Пройдя тестирование, вы допускаетесь к решению задач.

                        </div>
                        <hr/>

                        {
                            test.testInfo.user_test_answers.length === 0
                                ? <span style={{color: "rgba(255,0,0,0.5)"}}>Тестирование не пройдено</span>
                                :
                                <>
                                    <div>
                                        <span>Тестирование завершено </span>
                                        <span>
                                            {convertDate(test.testInfo.user_test_answers[0].createdAt)}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Набранные баллы: </span>
                                        <span>
                                            {test.testInfo.user_test_answers[0].user_test_score.score.score}/{test.testInfo.theme.difficulty_level_of_theme.testSolution * test.testInfo.questionsCount}
                                         </span>
                                    </div>
                                    <div>
                                        <span>Оценка: </span>
                                        <span>
                                            {test.testInfo.user_test_answers[0].user_test_score.score.rating}/5
                                        </span>
                                    </div>
                                </>
                        }


                    </div>
                    <div style={{
                        alignSelf: "flex-end",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "end",
                            fontSize: 10
                        }}>
                                    <span style={{fontSize: 10}}>
                                        Создано {convertDate(test.testInfo.createdAt)}
                                    </span>
                            <UserImgLink
                                _id={test.testInfo.createdBy._id}
                                role={test.testInfo.createdBy.role}
                                nickname={test.testInfo.createdBy.nickname}
                            />
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "end",
                            fontSize: 10
                        }}>
                                    <span style={{fontSize: 10}}>
                                        Обновлено {convertDate(test.testInfo.updatedAt)}
                                    </span>
                            <UserImgLink
                                _id={test.testInfo.updatedBy._id}
                                role={test.testInfo.updatedBy.role}
                                nickname={test.testInfo.updatedBy.nickname}
                            />
                        </div>
                    </div>
                </div>


            </>
        </Banner>
    );
});

export default TestBanner;