import React, {useState} from 'react';
import {Nav} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {TASKS_ROUTE, THEME_ONE_ROUTE, THEME_TEST_ROUTE} from "../../utils/constsPath";

const OneThemeTabs = ({route}) => {
    const {themeId} = useParams();
    const navigate = useNavigate()
    const [activeKey, setActiveKey] = useState(route);
    return (

        <Nav
            fill
            variant="tabs"
            activeKey={activeKey}
            onSelect={(key) => setActiveKey(key)}
            style={{marginBottom: 20}}
        >
            <Nav.Item>
                <Nav.Link
                    eventKey={THEME_ONE_ROUTE(themeId)}
                    onClick={() => navigate(THEME_ONE_ROUTE(themeId))}
                >
                    Теория и требования
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey={THEME_TEST_ROUTE(themeId)}
                    onClick={() => navigate(THEME_TEST_ROUTE(themeId))}
                >
                    Тестирование
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link
                    eventKey={TASKS_ROUTE(themeId)}
                    onClick={() => navigate(TASKS_ROUTE(themeId))}
                >
                    Задачи
                </Nav.Link>
            </Nav.Item>
        </Nav>

    );
};

export default OneThemeTabs;