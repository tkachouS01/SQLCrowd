import React, {useContext} from 'react';
import Stat from "./stat";
import {Button, Container, Form} from "react-bootstrap";
import {Context} from "../../index";
import {useParams} from "react-router-dom";


const EditTaskComponent = ({
                               id,
                               descriptionTask,
                               setDescriptionTask,
                               selectedDatabaseName,
                               setSelectedDatabaseName,
                               onSave
                           }) => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)

    return (

        <>
            {
                task.task.info.user.id === user.user.id
                    ?
                    (
                        <Form style={{background: "white", borderRadius: 10, padding: 15}}>
                            <Container style={{display: 'flex', flexWrap: 'nowrap'}}>
                                <div style={{flexBasis: '70%', marginRight: '10px'}}>
                                    <div>Описание задания</div>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        style={{resize: 'none'}}
                                        placeholder="Описание задания"
                                        value={descriptionTask}
                                        onChange={(e) => setDescriptionTask(e.target.value)}
                                    />
                                </div>
                                <div style={{flexBasis: '30%'}}>
                                    <div>Выбор используемой для решения БД</div>
                                    <Form.Control
                                        as="select"
                                        placeholder="База данных"
                                        value={selectedDatabaseName}
                                        onChange={(e) => setSelectedDatabaseName(e.target.value)}
                                    >
                                        <option value="Не выбрано" key={id}>Не выбрано</option>
                                        {task.task.databases.map((db, id) => (
                                            <option value={`${db.name}`} key={id}>{db.name} [{db.id}]</option>))}
                                    </Form.Control>
                                    <Button style={{marginTop: 20}} onClick={onSave}>Сохранить</Button>
                                </div>
                            </Container>
                        </Form>
                    )
                    : ( <></> )
            }

        </>


    );
};

export default EditTaskComponent;