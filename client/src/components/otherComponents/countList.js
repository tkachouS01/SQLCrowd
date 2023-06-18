import React from 'react';

const CountList = ({text}) => {
    return (
        <div>
            <div style={{textAlign: "end", fontSize: '15px', fontWeight: 100}}>
                {text}
            </div>

            <hr style={{margin: '5px 0 20px'}}/>
        </div>
    );
};

export default CountList;