import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from "./store/UserStore";
import TaskStore from "./store/TaskStore";
import SolutionStore from "./store/SolutionStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        task: new TaskStore(),
        solution: new SolutionStore()
    }}>
        <App/>
    </Context.Provider>
);
