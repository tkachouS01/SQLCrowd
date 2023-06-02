import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import ModulesStore from "./store/ModulesStore";
import ThemesStore from "./store/ThemesStore";
import UserStore from "./store/UserStore";
import TaskStore from "./store/TaskStore";
import SolutionStore from "./store/SolutionStore";
import App from "./App";
import RoleRequestsStore from "./store/RoleRequestsStore";
import TestStore from "./store/TestStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        module: new ModulesStore(),
        theme: new ThemesStore(),
        user: new UserStore(),
        task: new TaskStore(),
        solution: new SolutionStore(),
        roleRequests: new RoleRequestsStore(),
        test: new TestStore()
    }}>
        <App/>
    </Context.Provider>
);
