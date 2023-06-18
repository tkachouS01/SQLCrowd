import React, {useContext, useEffect} from 'react';
import style from "./themesList.module.css";
import ThemeItem from "./themeItem";
import {Context} from "../../index";

const ThemesList = ({moduleId}) => {
    const {theme} = useContext(Context)

    useEffect(() => {
    }, [theme.themes])
    if (!theme.themes || theme.themes.length < moduleId) return <></>
    return (
        <div style={{marginLeft: 20}}>
            {
                theme.themes[moduleId - 1].length === 0
                    ?
                    <div style={{textAlign: "center", color: "red"}}>Тем в данном модуле нет</div>
                    :
                    <ul className={style.push}>
                        {
                            theme.themes[moduleId - 1].map((item, index) => (
                                <ThemeItem key={index} moduleId={moduleId} themeId={item._id} themeIdInModule={index}/>
                            ))
                        }

                    </ul>
            }

        </div>
    );
};
export default ThemesList;