import React from 'react'
import {Container} from "react-bootstrap";
import UsersList from "../../components/UserComponents/UsersList";
import {observer} from "mobx-react-lite";

const UsersPage = observer(() => {
        return (
        <Container className="col-md-9">
            <UsersList/>
        </Container>
    )
})
export default UsersPage;