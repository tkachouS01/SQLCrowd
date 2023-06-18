import React from 'react';
import style from './myButtonStyle.module.css'

const MyButton = ({text, onClick}) => {
    return (
        <div className={style.btnContainer} style={{userSelect: "none"}}>
            <div
                onClick={onClick}
                className={style.btn}
            >
                <span>{text}</span>
            </div>
            <div className={style.line}></div>
        </div>
    );
};

export default MyButton;