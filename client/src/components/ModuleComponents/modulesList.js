import React, {useContext} from 'react';
import {Context} from "../../index";
import ModuleItem from "./moduleItem";
import CountList from "../otherComponents/countList";
import {observer} from "mobx-react-lite";

const ModulesList = observer(({showUpdateModule}) => {

    const {module} = useContext(Context)

    return (
        <div>
            <CountList text={`${module.modules.length} модулей`}/>
            {
                module.modules.length === 0
                    ?
                    <div style={{textAlign: "center"}}>Модулей нет</div>
                    :
                    <div style={{display: "flex", flexDirection: "column", rowGap: 20}}>
                        {
                            module.modules.map((item, index) => (
                                <div key={index}>
                                    <ModuleItem moduleId={index}
                                                showUpdateModule={index === module.modules.length - 1 && showUpdateModule}
                                    />
                                    {index < module.modules.length - 1 ? <hr/> : <></>}
                                </div>

                            ))
                        }
                    </div>
            }

        </div>

    );
});

export default ModulesList;