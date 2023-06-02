import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import React, {useContext, useEffect} from "react";
import {Context} from "./index";
import Message from "./components/otherComponents/message";
import NavBar from "./components/NavBar";
import LoadingComponent from "./components/otherComponents/LoadingComponent";
import {check} from "./httpRequests/authAPI";
import backImage from './static/background.jpg'

function App() {
    const {user} = useContext(Context);
    useEffect(() => {
        check(user).then(() => {
        })

    }, [user.isAuth])
    return (
        <BrowserRouter>
            <NavBar/>
            <div style={{
                marginTop: 50,
                minHeight: 'calc(100vh - 50px)',
                display: "flex",
                justifyContent: "center",
                backgroundImage: `url(${backImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                overflow: 'hidden',
            }}>
                <Message bodyText={user.errorMessage.message} headerText={user.errorMessage.status}/>
                <div
                    style={{
                        background: 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(20px)',
                        width: '90%',
                        height: '100%',
                        padding: 15,
                        borderRadius: 10,
                    }}>
                    <AppRouter/>
                </div>


            </div>
            <LoadingComponent/>
        </BrowserRouter>
    );
}

export default App;