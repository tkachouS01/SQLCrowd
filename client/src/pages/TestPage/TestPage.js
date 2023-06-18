import React, {useContext, useEffect, useState} from 'react';
import Quiz from "../../components/TestComponents/Quiz";
import OneThemeTabs from "../../components/ThemeComponents/OneThemeTabs";
import {Breadcrumb, Container} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {HOME_ROUTE, THEME_TEST_ROUTE, THEMES_ROUTE} from "../../utils/constsPath";
import {getInfoAboutTest, getOneTest} from "../../httpRequests/testAPI";
import {Context} from "../../index";
import Banner from "../../components/basicElements/banner";
import NoText from "../../components/basicElements/noText";
import UserImgLink from "../../components/basicElements/userImgLink";
import {convertDate} from "../../utils/utils";
import TestBanner from "../../components/basicElements/banners/testBanner";
import {observer} from "mobx-react-lite";

const TestPage = observer(() => {
    const [isLoading, setIsLoading]=useState(true)
    const navigate = useNavigate()
    const {user, test} = useContext(Context)
    const {themeId} = useParams();


    useEffect(() => {
        setIsLoading(true)
        getInfoAboutTest(user, test, themeId)
            .then(() => {
                getOneTest(user, test, themeId)
                    .then(() => {
                        setIsLoading(false)
                    })
                    .catch(() => {setIsLoading(false)})
            })
            .catch(() => {setIsLoading(false)})
    }, [])

    if (isLoading) return <></>
    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => navigate(HOME_ROUTE())}>Главная</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate(THEMES_ROUTE())}>Темы</Breadcrumb.Item>
                    <Breadcrumb.Item active>Тема #{themeId} (тестирование)</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <OneThemeTabs route={THEME_TEST_ROUTE(themeId)}/>
            <TestBanner/>

            <Quiz/>

        </div>
    );
});

export default TestPage;