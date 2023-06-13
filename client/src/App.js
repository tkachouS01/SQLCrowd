import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import React, {useContext, useEffect} from "react";
import {Context} from "./index";
import Message from "./components/otherComponents/message";
import NavBar from "./components/NavBar";
import {check} from "./httpRequests/authAPI";
import backImage from './static/background.jpg'
import githubLogo from './static/githubLogo.png'
import {Image} from "react-bootstrap";

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
            }}
                 className="animated"
            >
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

            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                columnGap: 15,
                background: "white",
                width: '100vw',
                height: '50px',
                boxShadow: '4px 0px 25px rgba(0, 0, 0, 0.8)',
                zIndex: 1000
            }}>
                <a href={'https://github.com/tkachouS01/SQLCrowd'}>
                    <Image src={githubLogo} style={{height: 40}}/>
                </a>

                <a style={{fontWeight: 1000, fontSize: 25, color: "rgb(62,113,178)", textDecoration: "none"}}
                   href={'http://bru.by/'}>БРУ</a>
                <a style={{color: "black", textDecoration: "none"}} href={'https://t.me/t_Serega_01'}>Ткачёв С.А.</a>
                <a style={{color: "black", textDecoration: "none"}} href={'https://t.me/+375299812625'}>Мрочек Т.В.</a>
                <a>sqlcrowd@yandex.by</a>
            </div>

        </BrowserRouter>
    );
}

export default App;