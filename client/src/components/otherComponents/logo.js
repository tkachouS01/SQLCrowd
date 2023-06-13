import React from 'react';
import  '../../styles/tasks.css'

const Logo = ({fontSize=50}) => {
    return (
        <div>
            <div style={{fontSize: fontSize, fontWeight:"bold", userSelect: "none"}} className="animateCharcter">SQLCrowd</div>
        </div>
    );
};

export default Logo;