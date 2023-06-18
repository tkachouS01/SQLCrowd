import React from 'react';

const NoText = ({text = 'не введено'}) => {
    return (
        <span style={{opacity: 0.5}}>{text}</span>
    );
};

export default NoText;