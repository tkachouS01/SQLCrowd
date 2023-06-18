import React, {useContext} from 'react';
import NoText from "../noText";
import {convertDate} from "../../../utils/utils";
import UserImgLink from "../userImgLink";
import Banner from "../banner";
import {Context} from "../../../index";

const TheoryBanner = () => {
    const {theme} = useContext(Context)

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
                        <div style={{fontSize: 25, fontWeight: 500, textTransform: "uppercase"}}>Теория к теме</div>
                        <div style={{fontWeight: 100, opacity: 0.7}}>
                            Модуль
                            <span style={{fontWeight: 500}}> {theme.currentTheme.module.name
                                ? `"${theme.currentTheme.module.name}"`
                                : <NoText text={" Название модуля отсутствует"}/>
                            }</span>.
                            Для прохождения темы необходимо изучить теорию и выполнить задания:
                            <ul>
                                <li><span>Решить тест</span></li>
                                <li><span>Создать {theme.currentTheme.numCreateTasks} задач</span></li>
                                <li><span>Оценить {theme.currentTheme.numEvaluationTasks} задач</span></li>
                            </ul>

                        </div>
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
                                Создано {convertDate(theme.currentTheme.createdAt)}
                            </span>
                            <UserImgLink
                                _id={theme.currentTheme.createdBy._id}
                                role={theme.currentTheme.createdBy.role}
                                nickname={theme.currentTheme.createdBy.nickname}
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
                                        Обновлено {convertDate(theme.currentTheme.updatedAt)}
                                    </span>
                            <UserImgLink
                                _id={theme.currentTheme.updatedBy._id}
                                role={theme.currentTheme.updatedBy.role}
                                nickname={theme.currentTheme.updatedBy.nickname}
                            />
                        </div>
                    </div>
                </div>


            </>
        </Banner>
    );
};

export default TheoryBanner;