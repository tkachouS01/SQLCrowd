import React, {useContext} from 'react'
import {Container} from "react-bootstrap";
import UsersList from "../../components/UserComponents/UsersList";
import {Context} from "../../index";
import {getUsers} from "../../httpRequests/userApi";
import {observer} from "mobx-react-lite";

const UsersPage = observer(() => {
        return (
        <Container className="col-md-9">
            <UsersList/>
        </Container>
    )
})
export default UsersPage;