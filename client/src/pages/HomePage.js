import React, {useContext, useEffect, useState} from 'react';
import {Breadcrumb, Table} from "react-bootstrap";
import {Context} from "../index";
import {getRating} from "../httpRequests/ratingAPI";
import UserImgLink from "../components/basicElements/userImgLink";
import {FaArrowUp, FaArrowDown} from 'react-icons/fa';

const SortableColumnHeader = ({title, column, sortColumn, sortDirection, setSortColumn, setSortDirection}) => {
    return (
        <th
            style={{cursor: "pointer", userSelect: "none"}}
            onClick={() => {
                setSortColumn(column);
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            }}>
            {title} {sortColumn === column && (sortDirection === 'asc'
            ? <FaArrowDown color={'rgba(255, 0, 0, 0.8)'}/>
            : <FaArrowUp color={'rgba(58,138,0,0.8)'}/>)}
        </th>
    );
};

const HomePage = () => {
    const {user, rating} = useContext(Context)
    const [usersRating, setUsersRating] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getRating(user, rating)
            .then(() => {
                setUsersRating(rating.usersRating);
                setIsLoading(false);
            })
    }, []);

    useEffect(() => {
        if (sortColumn) {
            setUsersRating([...rating.usersRating].sort((a, b) => {
                if (sortDirection === 'asc') {
                    return a[sortColumn] - b[sortColumn];
                } else {
                    return b[sortColumn] - a[sortColumn];
                }
            }));
        }
    }, [sortColumn, sortDirection]);

    if (isLoading) return <></>
    return (
        <div>
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item active>Главная</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div style={{marginTop: 15}}>
                <h2>Таблица рейтинга пользователей</h2>
                <Table bordered responsive>
                    <thead>
                    <tr className={'main-color-blue'}>
                        <SortableColumnHeader title="Пользователь" column="_id" sortColumn={sortColumn}
                                              sortDirection={sortDirection}
                                              setSortColumn={setSortColumn} setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="В банке" column="tasksInBank" sortColumn={sortColumn}
                                              sortDirection={sortDirection}
                                              setSortColumn={setSortColumn} setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="Из банка" column="solutionsFromBank" sortColumn={sortColumn}
                                              sortDirection={sortDirection}
                                              setSortColumn={setSortColumn} setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="Создано" column="tasksCreated" sortColumn={sortColumn}
                                              sortDirection={sortDirection}
                                              setSortColumn={setSortColumn} setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="Оценено" column="tasksEvaluated" sortColumn={sortColumn}
                                              sortDirection={sortDirection} setSortColumn={setSortColumn}
                                              setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="Баллы" column="scores" sortColumn={sortColumn}
                                              sortDirection={sortDirection}
                                              setSortColumn={setSortColumn} setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="Средняя оценка" column="averageRating" sortColumn={sortColumn}
                                              sortDirection={sortDirection} setSortColumn={setSortColumn}
                                              setSortDirection={setSortDirection}/>
                        <SortableColumnHeader title="Текущий рейтинг" column="currentRating" sortColumn={sortColumn}
                                              sortDirection={sortDirection} setSortColumn={setSortColumn}
                                              setSortDirection={setSortDirection}/>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        usersRating.map((item, index) =>
                                <tr key={index} className={item._id === user.user._id ? 'main-color-gray' : ''}>
                                    <td>
                                        <UserImgLink _id={item._id} nickname={item.nickname} role={item.role}/>
                                    </td>
                                    <td>
                                        {item.tasksInBank}
                                    </td>
                                    <td>
                                        {item.solutionsFromBank}
                                    </td>
                                    <td>
                                        {item.tasksCreated}
                                    </td>
                                    <td>
                                        {item.tasksEvaluated}
                                        <br/>
                                        <span style={{fontSize: 10}}>
                                            {
                                                rating.usersRating[0].sameRating
                                                    ? ``
                                                    : ''
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        {+(item.scores.toFixed(2))}
                                    </td>
                                    <td>
                                        {+(item.averageRating.toFixed(2))}
                                    </td>
                                    <td>
                                        {+(item.currentRating.toFixed(2))}
                                    </td>
                                </tr>
                        )
                    }
                    </tbody>
                </Table>
            </div>
        </div>
    );
};


export default HomePage;