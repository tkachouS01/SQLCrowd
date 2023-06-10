import React, {useContext, useEffect} from 'react';
import {Container, Dropdown, DropdownButton, Form, Table} from "react-bootstrap";
import {toJS} from "mobx";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import Diagramm from "./diagramm/diagramModal";

const TableView = observer(({selectedTable, setSelectedTable, tableNames}) => {
    let {user} = useContext(Context)
    let {task} = useContext(Context)

    let {solution} = useContext(Context)
    useEffect(() => {
        solution.setResult({fields: [], rows: []})
    }, [])
    useEffect(() => {
        if (solution.result) {
            setSelectedTable("Результирующая таблица");
        }
    }, [solution.result, setSelectedTable]);

    return (
        <>
            {
                task.currentTask.database && (task.currentTask.verified || (user.user._id === task.currentTask.user._id))
                    ?
                    (
                        <div>
                            <div style={{marginBottom: 20}}>
                                <>
                                    <Diagramm task={task.currentTask}/>
                                </>
                                <div style={{marginTop: 15}}>
                                    <DropdownButton id="table-dropdown" title={selectedTable}
                                                    onSelect={(eventKey) => setSelectedTable(eventKey)}
                                                    variant='none'
                                                    style={{
                                                        backgroundColor: 'rgba(0, 92, 124, 0.2)',
                                                        color: "white",
                                                        borderRadius: 15,
                                                        display: "inline-block"
                                                    }}
                                    >
                                        <Dropdown.Item key="0" eventKey="Результирующая таблица">Результирующая
                                            таблица</Dropdown.Item>
                                        <Dropdown.Divider/>
                                        {tableNames.map((table, index) => (
                                            <Dropdown.Item key={index + 1} eventKey={table}>{table}</Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                </div>

                            </div>

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
                                                                <Table bordered responsive>
                                                                    <thead>
                                                                    <tr style={{background: 'rgba(0, 92, 124, 0.1)'}}>
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
                                                                    {
                                                                        user.errorMessage.message
                                                                            ? user.errorMessage.status === '200' && user.errorMessage.message === 'Запрос исполнен, данные получены'
                                                                                ? <div
                                                                                    style={{color: "#9ACD32"}}>{"Пустой набор строк"}</div>
                                                                                : user.errorMessage.message === 'Запрос исполнен, данные получены'
                                                                                    ? <div
                                                                                        style={{color: "#ff5a6f"}}>{user.errorMessage.message}</div>
                                                                                    : <div>Здесь будут показаны результаты запроса</div>
                                                                            : <div>Здесь будут показаны результаты запроса</div>
                                                                    }
                                                                </div>
                                                            </>
                                                        )
                                                }

                                            </>

                                        )
                                        :
                                        (
                                            <Table bordered responsive>
                                                <thead>
                                                <tr style={{background: 'rgba(0, 92, 124, 0.1)'}}>
                                                    {task.databasesData[selectedTable].fields.map((field, id) => (
                                                        <th key={id}>{field}</th>))}
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    toJS(task.databasesData[selectedTable].rows).map((row, id) =>
                                                        (
                                                            <tr key={id}>
                                                                {
                                                                    task.databasesData[selectedTable]?.fields?.map((field, id) => {
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

                        </div>
                    )
                    : (<></>)
            }

        </>
    )

});

export default TableView;