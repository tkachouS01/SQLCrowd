import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import React, {useContext, useEffect} from "react";
import {Context} from "./index";
import Message from "./components/otherComponents/message";
import NavBar from "./components/NavBar";
import LoadingComponent from "./components/otherComponents/LoadingComponent";
import {check} from "./httpRequests/authApi";

function App() {
    const {user} = useContext(Context);
useEffect(()=>{
    check(user).then(()=>{})

},[user.isAuth])
    return (
        <BrowserRouter>
            <NavBar/>
            <div style={{marginTop: 50, padding: '30px 0px', minHeight: 'calc(100vh - 50px)', backgroundColor: 'rgba(0, 0, 0, 0.1)', display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Message bodyText={user.errorMessage.message} headerText={user.errorMessage.status}/>
                <AppRouter/>
                <LoadingComponent/>
            </div>
        </BrowserRouter>
    );
}

export default App;