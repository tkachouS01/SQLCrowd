import {useState, useEffect, useContext, useRef} from 'react';
import {Button, Toast} from 'react-bootstrap';
import {useObserver} from 'mobx-react-lite';
import {Context} from "../../index";
import {SIGN_IN_ROUTE, TASKS_ROUTE} from "../../utils/constsPath";
import {useNavigate} from "react-router-dom";

function Message() {

    const [show, setShow] = useState(false);
    let {user} = useContext(Context)
    const navigate = useNavigate();
    const firstRender = useRef(true);

    useEffect(() => {
        if (user.errorMessage.status === 401)
            navigate(SIGN_IN_ROUTE())
        /*else if (user.errorMessage.status === 404)
            navigate(TASKS_ROUTE(1))*/
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        setShow(true)
        const timer = setTimeout(() => {
            setShow(false);
        }, 5000);
        return () => {
            clearTimeout(timer);
        }
    }, [user.errorMessage]);

    return useObserver(() => (
        <>
            {
                user.errorMessage.message
                    ?
                    (
                        <>
                            <Toast show={show} onClose={() => setShow(false)}
                                   style={{position: "fixed", bottom: 20, right: 20, zIndex: 100}}>

                                <Toast.Header>
                                    <strong className="me-auto">Статус {user.errorMessage.status === 500 ? "Зовите быстрее сисадмина. Сервак поломался":user.errorMessage.status}</strong>
                                </Toast.Header>
                                <Toast.Body>{user.errorMessage.message}</Toast.Body>
                            </Toast>
                            {
                                show
                                ?<></>
                                    :
                                    <Button variant={'light'} onClick={()=>setShow(!show)} style={{position: "fixed", bottom: 0, right: 0, zIndex: 100,fontSize:10}}>
                                        <strong>ПОКАЗАТЬ</strong> сообщение
                                    </Button>
                            }

                        </>

                    )
                    :
                    (<></>)
            }
        </>


    ));
}

export default Message