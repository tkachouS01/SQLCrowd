import React, {useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../../index";
import style from './modulesStyle.module.css'
import {convertDate} from "../../utils/utils";
import ThemesList from "../ThemeComponents/themesList";
import MyButton from "../basicElements/myButton";
import {makeAvailableModule, updateModule} from "../../httpRequests/moduleAPI";
import {addTheme} from "../../httpRequests/themeAPI";
import {useNavigate} from "react-router-dom";
import {THEME_ONE_ROUTE} from "../../utils/constsPath";
import NoText from "../basicElements/noText";
import UserImgLink from "../basicElements/userImgLink";
import {observer} from "mobx-react-lite";
import TextareaAutosize from "react-textarea-autosize";

const ModuleItem = observer(({moduleId, showUpdateModule}) => {
        const {user} = useContext(Context)
        const {module} = useContext(Context)
        const {theme} = useContext(Context)

        const navigate = useNavigate()

        const createThemeClick = () => {
            addTheme(user, module, theme, moduleId)
                .then((themeId) => {
                    navigate(THEME_ONE_ROUTE(+themeId))
                })
        }

        const [showUpdateThemeForm, setShowUpdateThemeForm] = useState(showUpdateModule);

        const [updateNameModule, setUpdateNameModule] = useState(null)
        const [updateDescriptionModule, setUpdateDescriptionModule] = useState(null)


        const updateAvailableModuleClick = () => {
            makeAvailableModule(user, module, moduleId)
                .then(() => {
                })
                .catch(() => {
                })
        }
        const updateModuleRef = useRef(null);

        useEffect(() => {
            if (showUpdateThemeForm && updateModuleRef.current) {
                updateModuleRef.current.scrollIntoView({behavior: "smooth", block: "center"})
            }
        }, [showUpdateThemeForm]);

        const updateModuleClick = () => {
            setUpdateNameModule(module.modules[moduleId].name);
            setUpdateDescriptionModule(module.modules[moduleId].description)
            setShowUpdateThemeForm(true)
        }

        const saveModuleClick = () => {
            updateModule(user, module, module.modules[moduleId]._id, updateNameModule, updateDescriptionModule)
                .then((bool) => {
                    setShowUpdateThemeForm(!bool)
                })
                .catch(() => {
                })


        }
        return (
            <div ref={updateModuleRef} style={{display: "flex", flexDirection: "row"}} className={style.container}>
                <div style={{width: '40%', display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <div>
                        <div style={{fontSize: 15, fontWeight: 100, opacity: 0.5, paddingLeft: '15px'}}>
                            Модуль {module.modules[moduleId]._id}
                        </div>
                        {
                            showUpdateThemeForm
                                ? <></>
                                :
                                <>
                                    <div style={{fontSize: 20, fontWeight: 500, marginBottom: 10, paddingLeft: '15px'}}>
                                        {module.modules[moduleId].name || <NoText text={"Название модуля отсутствует"}/>}
                                    </div>
                                    <div style={{textIndent: '15px'}}>
                                        {module.modules[moduleId].description ||
                                            <NoText text={"Описание модуля отсутствует"}/>}
                                    </div>
                                </>
                        }

                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {
                            showUpdateThemeForm
                                ?
                                <>

                                    <div style={{
                                        alignSelf: "flex-start",
                                        width: '100%',
                                        margin: '10px 0',
                                        display: "flex",
                                        flexDirection: "column",
                                        rowGap: 15
                                    }}>
                                        <TextareaAutosize
                                            style={{
                                                resize: "none",
                                                width: '100%',
                                                border: '1px solid gray',
                                                padding: '10px',
                                                borderRadius: 10,
                                                borderStyle: "none"
                                            }}
                                            placeholder={'Изменение названия модуля'}
                                            autoFocus
                                            value={updateNameModule || ""}
                                            onChange={(e) => setUpdateNameModule(e.target.value)}
                                        />
                                        <TextareaAutosize
                                            style={{
                                                resize: "none",
                                                width: '100%',
                                                border: '1px solid gray',
                                                padding: '10px',
                                                borderRadius: 10,
                                                borderStyle: "none"
                                            }}
                                            placeholder={'Изменение описания модуля'}
                                            value={updateDescriptionModule || ""}
                                            onChange={(e) => setUpdateDescriptionModule(e.target.value)}
                                        />
                                    </div>
                                    <div style={{alignSelf: "end"}}>
                                        <MyButton text={`Сохранить изменения`} onClick={saveModuleClick}/>
                                    </div>

                                </>
                                :
                                <>
                                    {
                                        user.user.role === 'ADMIN'
                                            ?
                                            <div className={style.showThemeForm} style={{alignItems: "end"}}>
                                                <div>
                                                    <MyButton text={`Создать тему`} onClick={createThemeClick}/>
                                                </div>
                                                <div>
                                                    <MyButton text={`Редактировать модуль`} onClick={updateModuleClick}/>
                                                </div>

                                                <div>
                                                    <MyButton
                                                        text={`Допуск: ${module.modules[moduleId].isAvailable ? "да" : "нет"}`}
                                                        onClick={updateAvailableModuleClick}/>
                                                </div>

                                            </div>
                                            :
                                            <div>

                                            </div>
                                    }
                                </>

                        }
                    </div>

                    <div style={{
                        marginTop: 10,
                        fontSize: 10,
                        paddingLeft: '15px',
                        display: "flex",
                        flexDirection: "column",
                        gap: 5
                    }}>
                        <div
                            style={{display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 5}}>
                            <span>Создано: {convertDate(module.modules[moduleId].createdAt)}</span>
                            <UserImgLink
                                _id={module.modules[moduleId].createdBy._id}
                                role={module.modules[moduleId].createdBy.role}
                                nickname={module.modules[moduleId].createdBy.nickname}
                            />
                        </div>
                        <div
                            style={{display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 5}}>
                            <span>Обновлено: {convertDate(module.modules[moduleId].updatedAt)}</span>
                            <UserImgLink
                                _id={module.modules[moduleId].updatedBy._id}
                                role={module.modules[moduleId].updatedBy.role}
                                nickname={module.modules[moduleId].updatedBy.nickname}
                            />
                        </div>
                    </div>
                </div>
                <div style={{width: '60%'}}>
                    <ThemesList moduleId={module.modules[moduleId]._id}/>
                </div>

            </div>
        );
    })
;

export default ModuleItem;