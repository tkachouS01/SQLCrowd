import React, {useContext, useEffect, useRef} from 'react';
import {Container, Dropdown, DropdownButton, Form, Table} from "react-bootstrap";
import {toJS} from "mobx";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const TableView = observer( ({selectedTable, setSelectedTable, tableNames}) => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)
<<<<<<< HEAD
    let {solution} = useContext(Context)
    useEffect(()=>{solution.setResult({fields:[],rows:[]})},[])
    useEffect(() => {
        if (solution.result) {
            setSelectedTable("Результирующая таблица");
        }
    }, [solution.result, setSelectedTable]);
=======

>>>>>>> SQLCrowd/master
    return (
        <>
            {
                task.task.info.database && (task.task.info.verified || (user.user.id === task.task.info.user.id))
                    ?
                    (
                        <Container style={{background: "white", borderRadius: 10, padding: 15}}>
                            <Form className="d-flex flex-column">
                                <div style={{marginBottom: 15}}>Просмотр строк таблицы</div>
                                <DropdownButton id="table-dropdown" title={selectedTable}
                                                onSelect={(eventKey) => setSelectedTable(eventKey)}>
                                    <Dropdown.Item key="0" eventKey="Результирующая таблица">Результирующая таблица</Dropdown.Item>
                                    <Dropdown.Divider />
                                    {tableNames.map((table, index) => (
                                        <Dropdown.Item key={index + 1} eventKey={table}>{table}</Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Form>

                            <>
                                {
                                    selectedTable === "Результирующая таблица"
                                        ?
                                        (
                                            <>
                                                {
                                                    solution.result.rows.length !== 0
                                                        ?
                                                        (
                                                            <>
                                                                <Table striped bordered responsive>
                                                                    <thead>
                                                                    <tr>
                                                                        {
                                                                            solution.result.fields.map((field, id) => (
                                                                                <th key={id}>{field}</th>
                                                                            ))
                                                                        }
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        toJS(solution.result.rows).map((row, id) =>
                                                                            (
                                                                                <tr key={id}>
                                                                                    {
                                                                                        solution.result.fields.map((field, id) => {
                                                                                            return <td
                                                                                                key={id}>{row[field]}</td>
                                                                                        })
                                                                                    }
                                                                                </tr>
                                                                            )
                                                                        )
                                                                    }
                                                                    </tbody>
                                                                </Table>
                                                            </>
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                <div style={{textAlign: "center", margin: '20px 0px'}}>
                                                                    Здесь будут показаны результаты запроса
                                                                </div>
                                                            </>
                                                        )
                                                }

                                            </>

                                        )
                                        :
                                        (
                                            <Table striped bordered responsive>
                                                <thead>
                                                <tr>
                                                    {task.task.data[selectedTable].fields.map((field, id) => (
                                                        <th key={id}>{field}</th>))}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    toJS(task.task.data[selectedTable].rows).map((row, id) =>
                                                        (
                                                            <tr key={id}>
                                                                {
                                                                    task.task.data[selectedTable]?.fields?.map((field, id) => {
                                                                        return <td
                                                                            key={id}>{row[field]}</td>
                                                                    })
                                                                }
                                                            </tr>
                                                        )
                                                    )
                                                }
                                                </tbody>
                                            </Table>
                                        )
                                }
                            </>

                        </Container>
                    )
                    : (<></>)
            }

        </>
    )

});

export default TableView;