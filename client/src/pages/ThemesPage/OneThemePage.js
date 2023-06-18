import React, {useContext, useEffect, useState} from "react";
import {Breadcrumb, FloatingLabel, Form} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {getOneTheme, makeAvailableTheme, updateTheme} from "../../httpRequests/themeAPI";
import {useNavigate, useParams} from "react-router-dom";
import NoText from "../../components/basicElements/noText";
import MyButton from "../../components/basicElements/myButton";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    EditorState,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import "./oneThemeStyle.css";
import WordInput from "../../components/basicElements/WordInput";
import OneThemeTabs from "../../components/ThemeComponents/OneThemeTabs";
import {HOME_ROUTE, THEME_ONE_ROUTE, THEMES_ROUTE} from "../../utils/constsPath";
import TheoryBanner from "../../components/basicElements/banners/theoryBanner";

const OneThemePage = observer(() => {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const {user, theme, module} = useContext(Context);

    const {themeId} = useParams();

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [commands, setCommands] = useState([]);

    const [nameTheme, setNameTheme] = useState(null);
    const [levelTestSolution, setLevelTestSolution] = useState(1);
    const [levelTaskSolution, setLevelTaskSolution] = useState(1);
    const [levelTaskCreation, setLevelTaskCreation] = useState(1);
    const [levelTaskEvaluations, setLevelTaskEvaluations] = useState(1);
    const [numCreateTasks, setNumCreateTasks] = useState(1);
    const [numEvaluationTasks, setNumEvaluationTasks] = useState(1);


    const [testingOnly, setTestingOnly] = useState(true)


    const handleChange = (checked) => {
        setTestingOnly(checked);
        if (checked) {
            setCommands([]);
            setLevelTaskSolution(0)
            setLevelTaskCreation(0)
            setLevelTaskEvaluations(0)
            setNumCreateTasks(0)
            setNumEvaluationTasks(0)
        } else {
            setCommands([]);
            setLevelTaskSolution(1)
            setLevelTaskCreation(1)
            setLevelTaskEvaluations(1)
            setNumCreateTasks(1)
            setNumEvaluationTasks(1)

            setLevelTestSolution(1)
        }
    };

    useEffect(() => {
        setIsLoading(true)
        getOneTheme(user, module, theme, null, themeId)
            .then((r) => {

                setCommands(theme.currentTheme.sqlCommands)
                setNameTheme(theme.currentTheme.name)
                const content = theme.currentTheme.description;
                setNumCreateTasks(theme.currentTheme.numCreateTasks)
                setNumEvaluationTasks(theme.currentTheme.numEvaluationTasks)


                setLevelTestSolution(theme.currentTheme.difficulty_level_of_theme.testSolution)
                setLevelTaskSolution(theme.currentTheme.difficulty_level_of_theme.taskSolution)
                setLevelTaskCreation(theme.currentTheme.difficulty_level_of_theme.taskCreation)
                setLevelTaskEvaluations(theme.currentTheme.difficulty_level_of_theme.taskEvaluation)
                try {
                    const contentState = convertFromRaw(JSON.parse(content));
                    setEditorState(EditorState.createWithContent(contentState));

                } catch (error) {
                    setEditorState(EditorState.createEmpty())

                }
                setTestingOnly(theme.currentTheme.numCreateTasks === 0)
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
            });
    }, []);

    const saveTheme = () => {
        setIsLoading(true)
        const contentState = editorState.getCurrentContent();
        const content = JSON.stringify(convertToRaw(contentState));


        updateTheme(
            user,
            theme,
            module,
            null,
            theme.currentTheme._id,
            nameTheme,
            content,
            commands,
            numEvaluationTasks,
            numCreateTasks,
            {
                testSolution: levelTestSolution,
                taskSolution: levelTaskSolution,
                taskCreation: levelTaskCreation,
                taskEvaluation: levelTaskEvaluations
            }
        )
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    };

    const updateAvailableModuleClick = () => {
        setIsLoading(true)
        makeAvailableTheme(user, theme, null, theme.currentTheme._id)
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => setIsLoading(false))
    }

    if (isLoading) return <></>;
    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(THEMES_ROUTE())}>Темы</Breadcrumb.Item>
                    <Breadcrumb.Item active>Тема #{themeId} (теория и требования)</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <OneThemeTabs route={THEME_ONE_ROUTE(themeId)}/>
            <TheoryBanner/>

            <div>

                {
                    user.user.role === 'ADMIN'
                        ?
                        (
                            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 15}}>
                                <MyButton text={"Сохранить изменения"} onClick={saveTheme}/>
                                <MyButton text={`Допуск: ${theme.currentTheme.isAvailable ? "да" : "нет"}`}
                                          onClick={updateAvailableModuleClick}/>
                            </div>

                        )
                        :
                        <></>
                }
                {
                    user.user.role === 'ADMIN'
                        ?
                        <FloatingLabel label="Название темы">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={nameTheme}
                                onChange={(e) => setNameTheme(e.target.value)}
                            />
                        </FloatingLabel>
                        :
                        <div style={{fontSize: 25}}>Название темы: {theme.currentTheme.name ?
                            <span style={{fontWeight: 500}}>{theme.currentTheme.name}</span> :
                            <NoText text={'Название темы не введено'}/>}</div>
                }
                <div>Текст темы</div>
                <div
                    className={user.user.role === 'ADMIN' ? "showToolsTrue" : "showToolsFalse"}
                    style={{border: "1px solid #495057", padding: "20px 10px", borderRadius: "10px"}}
                >
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        readOnly={!(user.user.role === 'ADMIN')}
                    />
                </div>

            </div>

            {
                user.user.role === 'ADMIN'
                    ?
                    <Form.Check
                        type="switch"
                        label="Только тестирование"
                        checked={testingOnly}
                        onChange={(e) => handleChange(e.target.checked)}
                        readOnly={(user.user.role === 'ADMIN')}
                    />
                    : <></>
            }


            {
                testingOnly
                    ? <></>
                    : <WordInput commands={commands} setCommands={setCommands}
                                 showUpdateThemeForm={user.user.role === 'ADMIN'}/>
            }


            <div>
                <div style={{textAlign: "center", marginBottom: 10}}>Максимальное число баллов</div>
                {
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 10
                    }}>
                        <FloatingLabel label="Ответ на вопрос">
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder=" "
                                readOnly={!(user.user.role === 'ADMIN')}
                                value={levelTestSolution}
                                onChange={(e) => setLevelTestSolution(e.target.value)}
                            />
                        </FloatingLabel>
                        {
                            testingOnly
                                ?
                                <></>
                                :
                                <>
                                    <FloatingLabel label="Решение задачи из БЗ">
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            placeholder=" "
                                            readOnly={!(user.user.role === 'ADMIN')}
                                            value={levelTaskSolution}
                                            onChange={(e) => setLevelTaskSolution(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Создание задачи">
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            placeholder=" "
                                            readOnly={!(user.user.role === 'ADMIN')}
                                            value={levelTaskCreation}
                                            onChange={(e) => setLevelTaskCreation(e.target.value)}
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel label="Оценка задачи">
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            placeholder=" "
                                            readOnly={!(user.user.role === 'ADMIN')}
                                            value={levelTaskEvaluations}
                                            onChange={(e) => setLevelTaskEvaluations(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </>
                        }

                    </div>


                }

            </div>
            {
                testingOnly
                    ? <></>
                    :
                    <div>
                        <div style={{textAlign: "center", marginBottom: 10}}>Минимальное число заданий для прохождения
                            темы
                        </div>
                        {
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 10
                            }}>
                                <FloatingLabel label="Создание задач">
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        placeholder=" "
                                        readOnly={!(user.user.role === 'ADMIN')}
                                        value={numCreateTasks}
                                        onChange={(e) => setNumCreateTasks(e.target.value)}
                                    />
                                </FloatingLabel>
                                <FloatingLabel label="Оценка задач">
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        placeholder=" "
                                        readOnly={!(user.user.role === 'ADMIN')}
                                        value={numEvaluationTasks}
                                        onChange={(e) => setNumEvaluationTasks(e.target.value)}
                                    />
                                </FloatingLabel>
                            </div>


                        }

                    </div>
            }


        </div>
    );
});

export default OneThemePage;