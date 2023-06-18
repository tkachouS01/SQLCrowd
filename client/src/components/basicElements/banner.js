import React from 'react';
import style from './bannerStyle.module.css'

const Banner = ({children}) => {
    return (
        <div className={style.banner_container}>
            {children}
        </div>
    );
};

export default Banner;