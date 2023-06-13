import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {Button, FloatingLabel, Form} from 'react-bootstrap';
import {SIGN_IN_ROUTE, SIGN_UP_ROUTE} from '../../utils/constsPath';
import {exit, signIn, signUp} from '../../httpRequests/authAPI';
import {observer} from 'mobx-react-lite';
import {Context} from '../../index';
import Logo from "../../components/otherComponents/logo";

const AuthPage = observer(() => {
    const {user} = useContext(Context);

    const [login, setLogin] = useState('');

    const location = useLocation();

    let navigate = useNavigate()

    const isLogin = location.pathname === SIGN_IN_ROUTE();

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');

    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [gender, setGender] = useState('Не указано');
    const [date_of_birth, setDateOfBirth] = useState(undefined);

    useEffect(() => {
        exit(user)
    }, []);

    const click = async () => {
        if (isLogin) {
            await signIn(user, navigate, login, password)
        } else {
            await signUp(user, email, nickname, surname, name, patronymic, gender, date_of_birth);
        }
    };
    return (
        <div>
            {
                isLogin
                    ?
                    <div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            height: '100%'
                        }}>
                            <div style={{
                                flexGrow: 0.6,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>
                                <Logo/>
                                <div style={{fontSize: '25px', textTransform: "uppercase", fontWeight: 100}}>Вход в
                                    систему
                                </div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", flexGrow: 0.4}}>
                                <div style={{display: "flex", flexDirection: "column", gap: 15}}>
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
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginTop: 50,
                            alignItems: "center"
                        }}>
                            <div>
                                <Button style={{
                                    background: "#005c7c",
                                    border: "none",
                                    fontSize: 25,
                                    padding: '5px 40px',
                                    borderRadius: 15
                                }} onClick={click}>
                                    Войти
                                </Button>
                            </div>

                            <div style={{marginTop: 10}}>
                                Вы впервые?
                                <NavLink to={SIGN_UP_ROUTE()} style={{color: "black", marginLeft: 5}}>Создать
                                    аккаунт</NavLink>
                            </div>

                        </div>

                    </div>
                    :
                    <div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            height: '100%'
                        }}>
                            <div style={{
                                flexGrow: 0.6,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>
                                <Logo/>
                                <div style={{fontSize: '25px', textTransform: "uppercase", fontWeight: 100}}>Регистрация
                                    в
                                    системе
                                </div>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", flexGrow: 0.4}}>
                                <div style={{display: "flex", flexDirection: "column", gap: 15}}>
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
                                </div>

                            </div>

                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginTop: 50,
                            alignItems: "center"
                        }}>
                            <div>
                                <Button style={{
                                    background: "#005c7c",
                                    border: "none",
                                    fontSize: 25,
                                    padding: '5px 40px',
                                    borderRadius: 15
                                }} onClick={click}>
                                    Присоединиться
                                </Button>
                            </div>

                            <div style={{marginTop: 10}}>
                                Вы были ранее?
                                <NavLink to={SIGN_IN_ROUTE()} style={{color: "black", marginLeft: 5}}>Войти в
                                    существующий аккаунт</NavLink>
                            </div>

                        </div>
                    </div>
            }
        </div>);
});

export default AuthPage;