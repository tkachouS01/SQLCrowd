import Modal from 'react-bootstrap/Modal';
import React, {useContext, useEffect, useState} from 'react';

import {Image} from "react-bootstrap";
import {Context} from "../../../index";
import {getImage} from "../../../httpRequests/userAPI";
import MyButton from "../../basicElements/myButton";


const Diagram = ({task}) => {
    const {user} = useContext(Context);
    const [url, setUrl] = useState('');
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getImage(user, task.database.name);
                setUrl(data);
            } catch (error) {
            }
        }

        fetchData();

    }, [user, task]);


    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);

    function handleShow(breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
    }

    return (
        <>
            <div>
                <MyButton size="sm" text={"Схема бызы данных"} onClick={() => setShow(true)}/>
            </div>


            <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Схема базы данных: <span style={{fontWeight: 700}}>{task.database.name}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image src={url} style={{height: '100%'}}/>
                </Modal.Body>
            </Modal>
        </>

    );
}

export default Diagram;



