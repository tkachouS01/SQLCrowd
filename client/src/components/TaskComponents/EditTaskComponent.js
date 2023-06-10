import React, {useContext} from 'react';
import {Button, Container, FloatingLabel, Form} from "react-bootstrap";
import {Context} from "../../index";
import TextareaAutosize from "react-textarea-autosize";
import MyButton from "../basicElements/myButton";


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
                        <div style={{borderRadius: 10, padding: 15}}>
                            <div style={{display: 'flex', flexWrap: 'nowrap'}}>
                                <div style={{flexBasis: '70%', marginRight: '10px'}}>

                                    <TextareaAutosize
                                        value={descriptionTask}
                                        onChange={(e) => setDescriptionTask(e.target.value)}
                                        style={{
                                            resize: "none",
                                            width: '100%',
                                            border: '1px solid gray',
                                            padding: '10px',
                                            borderRadius: 10
                                        }}
                                        placeholder={'Введите описание задания'}
                                    />
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
                                    <MyButton text={"Сохранить"} onClick={onSave}/>

                                </div>
                            </div>
                        </div>
                    )
                    : (<></>)
            }

        </>


    );
};

export default EditTaskComponent;