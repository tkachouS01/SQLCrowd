import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-cloud9_day';

<<<<<<< HEAD
function CodeEditor({codeSolution, setCodeSolution,readonly}) {
=======
function CodeEditor({codeSolution, setCodeSolution}) {
    console.log("codeSolution")
    console.log(codeSolution)
>>>>>>> SQLCrowd/master
        return (
        <AceEditor
            mode="sql"
            theme="cloud9_day"
            value={codeSolution}
            onChange={(e) => setCodeSolution(e)}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                showLineNumbers: true
            }}
            width="100%"
            fontSize={20}
            maxLines={Infinity}
            readOnly={readonly}
        />
    );
}

export default CodeEditor;
