import React, {useContext} from 'react';
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {THEME_ONE_ROUTE} from "../../utils/constsPath";
import styles from './../ModuleComponents/modulesStyle.module.css'

const ThemeItem = ({moduleId, themeId, themeIdInModule}) => {
    const {module, user} = useContext(Context)
    const {theme} = useContext(Context)
    const navigate = useNavigate()

    return (
        <li
            className={styles.container1}
            onClick={() => {
                navigate(THEME_ONE_ROUTE(themeId))
            }}
        >
            <span style={{fontWeight: 500, fontSize: 20, paddingRight: 20}}>{moduleId}.{themeIdInModule + 1}</span>
            <span>{theme.themes[moduleId - 1][themeIdInModule].name ||
                <span style={{opacity: 0.5}}>Название не введено</span>}</span>
            {
                user.user.role !== 'ADMIN'
                    ?
                    <div
                        className={styles.showThemeForm1}
                        style={{
                            zIndex: 100,
                            background: "rgba(255,255,255,0.9)",
                            position: "fixed",
                            padding: '10px 30px',
                            borderRadius: 10,
                            boxShadow: '0px 0px 20px rgba(0,0,0,0.5)',
                            marginTop: 15,
                        }}
                    >


                        {
                            theme.themes[moduleId - 1][themeIdInModule].created.maxCount === 0
                                ? <></>
                                :
                                <div>
                                    Создано: {theme.themes[moduleId - 1][themeIdInModule].created.currentCount} из
                                    {" " + theme.themes[moduleId - 1][themeIdInModule].created.maxCount} задач.
                                </div>
                        }
                        {
                            theme.themes[moduleId - 1][themeIdInModule].evaluated.maxCount === 0
                                ? <></>
                                :
                                <div>
                                    Оценено: {theme.themes[moduleId - 1][themeIdInModule].evaluated.currentCount} из
                                    {" " + theme.themes[moduleId - 1][themeIdInModule].evaluated.maxCount} задач.
                                </div>

                        }
                        {
                            theme.themes[moduleId - 1][themeIdInModule].created.maxCount === 0
                                ? <></>
                                :
                                <div>
                                    БЗ: {theme.themes[moduleId - 1][themeIdInModule].fromBank.currentCount} задач.
                                </div>

                        }
                        {

                            <div>
                                Тест:
                                {
                                    theme.themes[moduleId - 1][themeIdInModule].tested.rating === 'Тест не решен'
                                        ? ' не пройдено'
                                        :
                                        `
                                        ${theme.themes[moduleId - 1][themeIdInModule].tested.score} из
                                        ${" " + theme.themes[moduleId - 1][themeIdInModule].tested.scoreMax}.
                                        ${" Оценка " + theme.themes[moduleId - 1][themeIdInModule].tested.rating}
                                        `
                                }


                            </div>

                        }


                    </div>
                    : <></>
            }


        </li>
    );
};

export default ThemeItem;