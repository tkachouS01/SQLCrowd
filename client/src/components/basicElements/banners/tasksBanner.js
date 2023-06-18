import React, {useContext} from 'react';
import Banner from "../banner";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";

const TasksBanner = observer(() => {
    const {task} = useContext(Context)

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
                        <div style={{fontSize: 25, fontWeight: 500, textTransform: "uppercase"}}>Задачи</div>
                        <div style={{fontWeight: 100, opacity: 0.7}}>
                            Для прохождения темы необходимо выполнить минимум заданий.
                        </div>
                        <hr/>

                        Текущая ситуация:
                        <br/>
                        Создано <span
                        style={{fontWeight: 500}}>{task.currentProgress.created.current} из {task.currentProgress.created.max} задач</span>.
                        Оценено <span
                        style={{fontWeight: 500}}>{task.currentProgress.evaluated.current} из {task.currentProgress.evaluated.max} задач</span>.
                        Решено из банка задач <span
                        style={{fontWeight: 500}}>{task.currentProgress.fromBank.current} задач</span>.
                    </div>

                </div>


            </>
        </Banner>
    );
});

export default TasksBanner;