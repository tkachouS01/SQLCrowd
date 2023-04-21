import React from 'react'
import {Route, Routes} from "react-router-dom";
import TasksPage from "../pages/TaskPages/TasksPage";
import UsersPage from "../pages/UserPages/UsersPage";
import UserPage from "../pages/UserPages/UserPage";
import TaskSolutionPage from "../pages/TaskPages/TaskSolutionPage";
import AuthPage from "../pages/AuthPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import SolutionsPage from "../pages/SolutionPages/SolutionsPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route key="1" path="/users" element={<UsersPage/>} strict/>
            <Route key="2" path="/users/:id" element={<UserPage/>} strict/>
            <Route key="3" path="/tasks" element={<TasksPage/>} strict/>
            <Route key="4" path="/tasks/:id" element={<TaskSolutionPage/>} strict/>
            <Route key="5" path="/tasks/:id/solutions" element={<SolutionsPage/>} strict/>

            <Route key="6" path="/signin" element={<AuthPage/>} strict/>
            <Route key="7" path="/signup" element={<AuthPage/>} strict/>

            <Route key="8" path="/" element={<HomePage/>} strict/>
            <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
    )
}
export default AppRouter;