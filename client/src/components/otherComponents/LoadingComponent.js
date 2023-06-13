import React from 'react';
import {observer} from "mobx-react-lite";
import Logo from "./logo";

const LoadingComponent = observer(() => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: '100vh',
                marginTop: '-50px',
                zIndex: 99,
            }}
        >
            <div style={{marginBottom: 10, fontSize: 50, fontWeight: 100}}><Logo/></div>
            <div className="spinner-border" role="status"/>
            <div style={{marginTop: 10}}>Выполняется запрос на сервер. Подождите...</div>
        </div>
    );
});

export default LoadingComponent;