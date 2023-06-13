import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import ModulesStore from "./store/ModulesStore";
import ThemesStore from "./store/ThemesStore";
import UserStore from "./store/UserStore";
import TaskStore from "./store/TaskStore";
import SolutionStore from "./store/SolutionStore";
import App from "./App";
import TestStore from "./store/TestStore";
import RatingStore from "./store/RatingStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        module: new ModulesStore(),
        theme: new ThemesStore(),
        user: new UserStore(),
        task: new TaskStore(),
        solution: new SolutionStore(),
        test: new TestStore(),
        rating: new RatingStore()
    }}>
        <App/>
    </Context.Provider>
);
