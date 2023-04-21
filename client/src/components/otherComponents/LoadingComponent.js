import React, {useContext} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const LoadingComponent = observer(() => {
    const {user} = useContext(Context);

    if(user.isLoading)
    {
        console.log("ЖДЁМС")
        return (
            <div
                className="d-flex justify-content-center align-items-center flex-column"
                style={{
                    position: "fixed",
                    top: 50,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 99,
                    backdropFilter: 'blur(15px)'
                }}
            >
                <div style={{marginBottom: 10, fontSize: 50, fontWeight: 100}}>SQLCrowd</div>
                <div className="spinner-border" role="status"/>
                <div style={{marginTop: 10}}>Выполняется запрос на сервер. Подождите...</div>
            </div>
        );
    }
    else {return <></>}

});

export default LoadingComponent;