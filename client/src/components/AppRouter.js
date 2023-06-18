import React from 'react'
import {Route, Routes} from "react-router-dom";
import UsersPage from "../pages/UserPages/UsersPage";
import UserPage from "../pages/UserPages/UserPage";
import OneTaskPage from "../pages/TaskPages/OneTaskPage";
import AuthPage from "../pages/AuthPages/AuthPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import SolutionsPage from "../pages/SolutionPages/SolutionsPage";

import {
    HOME_ROUTE,
    SIGN_IN_ROUTE,
    SIGN_UP_ROUTE,
    USERS_ROUTE,
    USER_ONE_ROUTE,
    THEMES_ROUTE,
    THEME_ONE_ROUTE,
    THEME_TEST_ROUTE,
    TASKS_ROUTE,
    TASK_ONE_ROUTE,
    SOLUTIONS_ROUTE, SOLUTION_ONE_ROUTE,
} from '../utils/constsPath'
import ThemesPage from "../pages/ThemesPage/ThemesPage";
import OneThemePage from "../pages/ThemesPage/OneThemePage";
import TestPage from "../pages/TestPage/TestPage";
import TasksPage from "../pages/TasksPage/TasksPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route key="1" path={HOME_ROUTE()} element={<HomePage/>} strict/>
            <Route key="2" path={SIGN_UP_ROUTE()} element={<AuthPage/>} strict/>
            <Route key="3" path={SIGN_IN_ROUTE()} element={<AuthPage/>} strict/>
            <Route key="4" path={USERS_ROUTE()} element={<UsersPage/>} strict/>
            <Route key="5" path={USER_ONE_ROUTE(':userId')} element={<UserPage/>} strict/>
            <Route key="6" path={THEMES_ROUTE()} element={<ThemesPage/>} strict/>
            <Route key="7" path={THEME_ONE_ROUTE(':themeId')} element={<OneThemePage/>} strict/>
            <Route key="8" path={THEME_TEST_ROUTE(':themeId')} element={<TestPage/>} strict/>
            <Route key="9" path={TASKS_ROUTE(':themeId')} element={<TasksPage/>} strict/>

            <Route key="11" path={TASK_ONE_ROUTE(':themeId', ':taskId')} element={<OneTaskPage/>} strict/>
            <Route key="12" path={SOLUTION_ONE_ROUTE(':themeId', ':taskId', 'userId')} element={<SolutionsPage/>} strict/>
            <Route key="12" path={SOLUTIONS_ROUTE(':themeId', ':taskId')} element={<SolutionsPage/>} strict/>
            <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
    )
}
export default AppRouter;