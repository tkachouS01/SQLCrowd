import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {Button, Card, Container, Form} from 'react-bootstrap';
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
        <Container style={{display:"flex",justifyContent:"center"}}>
            <Card style={{width:600}} className="p-5">
                {isLogin ? (<>


                    <h2 className="m-auto" style={{textAlign: "center"}}>ВХОД В СИСТЕМУ</h2>

                    <div style={{display: "flex", justifyContent: "center"}}><Logo/></div>
                    <Form className="d-flex flex-column">
                        <Form.Control
                            className="mt-3"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                        <Form.Control
                            className="mt-3"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="d-flex justify-content-between mt-5 flex-wrap">
                            <div>
                                Нет аккаунта? <NavLink to={SIGN_UP_ROUTE}>Зарегистрируйтесь</NavLink>
                            </div>
                            <Button variant={'outline-success'} onClick={click}>
                                Войти
                            </Button>
                        </div>
                    </Form>
                </>) : (<>


                    <h2 className="m-auto" style={{textAlign: "center"}}>РЕГИСТРАЦИЯ В СИСТЕМЕ</h2>

                    <div style={{display: "flex", justifyContent: "center"}}><Logo/></div>
                    <Form className="d-flex flex-column">
                        <Form.Control
                            type="email"
                            className="mt-3 required"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            className="mt-3 required"
                            placeholder="Никнейм"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            className="mt-3"
                            placeholder="Фамилия"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            className="mt-3"
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            className="mt-3"
                            placeholder="Отчество"
                            value={patronymic}
                            onChange={(e) => setPatronymic(e.target.value)}
                        />
                        <Form.Control
                            className="mt-3"
                            as="select"
                            placeholder="Пол"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="Не указано">Не указано</option>
                            <option value="М">Мужской</option>
                            <option value="Ж">Женский</option>
                        </Form.Control>
                        <Form.Control
                            type="date"
                            className="mt-3"
                            placeholder="Дата рождения"
                            value={date_of_birth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                        <Form.Control
                            type="password"
                            className="mt-3"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="d-flex justify-content-between mt-5 flex-wrap">
                            <div>
                                Есть аккаунт? <NavLink to={SIGN_IN_ROUTE}>Войдите</NavLink>
                            </div>
                            <Button variant={'outline-success'} onClick={click}>
                                Регистрация
                            </Button>
                        </div>
                    </Form>
                </>)}
            </Card>
        </Container>);
});

export default AuthPage;