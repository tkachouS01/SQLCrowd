import React, {useContext, useEffect, useState} from 'react'
import {Breadcrumb} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {addModule, getAllModules} from "../../httpRequests/moduleAPI";
import MyButton from "../../components/basicElements/myButton";
import ModulesList from "../../components/ModuleComponents/modulesList";
import {HOME_ROUTE} from "../../utils/constsPath";
import {useNavigate} from "react-router-dom";

const ThemesPage = observer(() => {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const {user} = useContext(Context)
    const {module} = useContext(Context)
    const {theme} = useContext(Context)

    const [showCreateModule, setShowCreateModule] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        theme.setThemes([])
        getAllModules(user, module, theme)
            .then((bool) => {
                if (theme.themes.length === module.modules.length) {
                }
                setIsLoading(false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }, [])
    const createModule = () => {
        setIsLoading(true)
        if (showCreateModule) setShowCreateModule(false)
        addModule(user, module, theme)
            .then((_id) => {
                setShowCreateModule(true)
                setIsLoading(false)
            })
            .catch(() => {
                setShowCreateModule(false);
                setIsLoading(false)
            })

    }
    useEffect(() => {
    }, [isLoading])
    if (isLoading) return <></>
    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item active>Темы</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {
                <>
                    {
                        user.user.role === 'ADMIN'
                            ?
                            <>
                                <MyButton text={"Создать модуль"}
                                          onClick={createModule}/>
                            </>
                            :
                            <>

                            </>
                    }
                </>
            }
            <ModulesList showUpdateModule={showCreateModule}/>
        </div>
    )
});
export default ThemesPage;