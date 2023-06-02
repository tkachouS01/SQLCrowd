import React, {useContext} from 'react';
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import {Context} from "../../index";


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
                task.currentTask.user._id === user.user._id
                    ?
                    (
                        <Form style={{background: "white", borderRadius: 10, padding: 15}}>
                            <Container style={{display: 'flex', flexWrap: 'nowrap'}}>
                                <div style={{flexBasis: '70%', marginRight: '10px'}}>
                                    <FloatingLabel label="Введите описание задания">
                                        <Form.Control
                                            as="textarea"
                                            style={{ height: '150px', resize: 'none'}}
                                            placeholder=" "
                                            value={descriptionTask}
                                            onChange={(e) => setDescriptionTask(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </div>
                                <div style={{flexBasis: '30%'}}>


                                    <FloatingLabel label="Выбор используемой БД">
                                        <Form.Control
                                            as="select"
                                            placeholder=" "
                                            value={selectedDatabaseName}
                                            onChange={(e) => setSelectedDatabaseName(e.target.value)}
                                        >
                                            <option value="Не выбрано" key={id}>Не выбрано</option>
                                            {task.databases.map((db, id) => (
                                                <option value={`${db.name}`} key={id}>{db.name} [{db._id}]</option>))}
                                        </Form.Control>
                                    </FloatingLabel>

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