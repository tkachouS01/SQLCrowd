import React from 'react';
import Logo from "../components/otherComponents/logo";

const NotFoundPage = () => {
    return (
        <div>
            <div
                className="d-flex justify-content-center align-items-center flex-column"

            >
                <Logo/>

                <div style={{fontSize: 100, fontWeight: 100}}>404</div>

                <div>Запрашиваемая страница не найдена</div>
            </div>
        </div>
    );
};

export default NotFoundPage;