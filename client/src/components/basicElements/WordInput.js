import React, {useState} from 'react';
import {FloatingLabel, Form} from 'react-bootstrap';
import NoText from "./noText";

const WordInput = ({commands, setCommands, showUpdateThemeForm}) => {

    const [currentWord, setCurrentWord] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const trimmedWord = currentWord.trim();
            if (trimmedWord.length > 0) {
                if (editIndex !== null) {
                    const newWords = [...commands];
                    newWords[editIndex] = trimmedWord;
                    setCommands(newWords);
                    setEditIndex(null);
                } else {
                    setCommands([...commands, trimmedWord]);
                }
                setCurrentWord('');
            }
        }
    };

    const handleChange = (event) => {
        setCurrentWord(event.target.value);
    };

    const handleWordClick = (index) => {
        setEditIndex(index);
        setCurrentWord(commands[index]);
    };

    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                <div style={{paddingRight: 5}}>Рекомендуемые sql-комманды для создания задания</div>
                {
                    commands.length
                        ? <></>
                        : <NoText/>
                }
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 5}}>
                {
                    commands.map((word, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'lightgreen',
                                    cursor: 'pointer',
                                    padding: '1px 5px',
                                    borderRadius: '5px',
                                }}
                                onClick={() => handleWordClick(index)}
                            >
                                {word}
                            </div>
                        )
                    )
                }
            </div>

            {
                showUpdateThemeForm
                    ?
                    <div>
                        <FloatingLabel label="Введите SQL-комманду">
                            <Form.Control
                                type="text"
                                placeholder=" "
                                value={currentWord}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FloatingLabel>
                    </div>

                    :
                    <></>
            }
        </div>
    );
};

export default WordInput;
