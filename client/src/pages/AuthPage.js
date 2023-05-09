import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {Button, Card, Container, FloatingLabel, Form} from 'react-bootstrap';
import {SIGN_IN_ROUTE, SIGN_UP_ROUTE} from '../utils/constsPath';
import {exit, signIn, signUp} from '../httpRequests/authApi';
import {observer} from 'mobx-react-lite';
import {Context} from '../index';
import Logo from "../components/otherComponents/logo";

const AuthPage = observer(() => {
    const {user} = useContext(Context);

    const [login, setLogin] = useState('');

    const location = useLocation();

    let navigate = useNavigate()

    const isLogin = location.pathname === SIGN_IN_ROUTE;

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [gender, setGender] = useState('Не указано');
    const [date_of_birth, setDateOfBirth] = useState(undefined);
    const [password, setPassword] = useState('');

    useEffect(() => {
        exit(user)
    }, []);

    const click = async () => {
        if (isLogin) {
            await signIn(user, navigate, login, password)
        } else {
            await signUp(user, email, nickname, surname, name, patronymic, gender, date_of_birth, password);
        }
    };

    return (
        <Container style={{display: "flex", justifyContent: "center"}}>
            <Card style={{width: 600, background: "white", borderRadius: 50}}>
                {isLogin ? (<>

                    <div style={{
                        width: '100%',
                        background: "#415bc4",
                        padding: 30,
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50
                    }}>
                        <h2 className="m-auto" style={{textAlign: "center", color: "white", fontWeight: 700}}>ВХОД В
                            СИСТЕМУ</h2>

                        <div style={{display: "flex", justifyContent: "center"}}><Logo/></div>
                    </div>

                    <Form className="d-flex flex-column p-5" style={{gap: 15}}>

                        <FloatingLabel label="Введите логин">
                            <Form.Control
                                type="login"
                                placeholder=" "
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </FloatingLabel>


                        <FloatingLabel label="Введите пароль">
                            <Form.Control
                                type="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FloatingLabel>

                        <div className="d-flex justify-content-between mt-5 flex-wrap">
                            <div>
                                <NavLink to={SIGN_UP_ROUTE} style={{color: "black"}}>Создать аккаунт</NavLink>
                            </div>
                            <Button style={{background: "#415bc4", border: "none"}} onClick={click}>
                                Войти
                            </Button>
                        </div>
                    </Form>
                </>) : (<>

                    <div style={{
                        width: '100%',
                        background: "#415bc4",
                        padding: 30,
                        borderTopLeftRadius: 50,
                        borderTopRightRadius: 50
                    }}>
                        <h2 className="m-auto" style={{textAlign: "center", color: "white"}}>РЕГИСТРАЦИЯ В СИСТЕМЕ</h2>

                        <div style={{display: "flex", justifyContent: "center"}}><Logo/></div>
                    </div>

                    <Form className="d-flex flex-column p-5" style={{gap: 15}}>

                        <FloatingLabel label="Введите email">
                            <Form.Control
                                type="email"
                                className="required"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Введите никнейм">
                            <Form.Control
                                type="text"
                                className="required"
                                placeholder=" "
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Введите фамилию">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Введите имя">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Введите отчество">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={patronymic}
                                onChange={(e) => setPatronymic(e.target.value)}
                            />
                        </FloatingLabel>

                        <FloatingLabel label="Выберите пол">
                            <Form.Control
                                as="select"
                                aria-label=" "
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="Не указано">Не указано</option>
                                <option value="М">Мужской</option>
                                <option value="Ж">Женский</option>
                            </Form.Control>
                        </FloatingLabel>

                        <FloatingLabel label="Введите дату рождения">
                            <Form.Control
                                type="date"
                                placeholder=" "
                                value={date_of_birth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </FloatingLabel>

                        <FloatingLabel label="Введите пароль">
                            <Form.Control
                                type="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FloatingLabel>

                        <div className="d-flex justify-content-between mt-5 flex-wrap">
                            <div>
                                <NavLink to={SIGN_IN_ROUTE} style={{color: "black"}}>Войти в существующий
                                    аккаунт</NavLink>
                            </div>
                            <Button style={{background: "#415bc4", border: "none"}} onClick={click}>
                                Регистрация
                            </Button>
                        </div>
                    </Form>
                </>)}
            </Card>
        </Container>);
});

export default AuthPage;