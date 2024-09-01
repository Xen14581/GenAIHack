import Editor from '@monaco-editor/react';
import { Box, Stack, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useRef } from 'react';

const CodeEditor = ({ codeTemplate }) => {

    const supportedLanguages = [{id:1,name:'apex'},{id:2,name:'azcli'},{id:3,name:'bat'},{id:4,name:'c'},{id:5,name:'clojure'},{id:6,name:'coffeescript'},{id:7,name:'cpp'},{id:8,name:'csharp'},{id:9,name:'csp'},{id:10,name:'css'},{id:11,name:'dockerfile'},{id:12,name:'fsharp'},{id:13,name:'go'},{id:14,name:'graphql'},{id:15,name:'handlebars'},{id:16,name:'html'},{id:17,name:'ini'},{id:18,name:'java'},{id:19,name:'javascript'},{id:20,name:'json'},{id:21,name:'kotlin'},{id:22,name:'less'},{id:23,name:'lua'},{id:24,name:'markdown'},{id:25,name:'msdax'},{id:26,name:'mysql'},{id:27,name:'objective-c'},{id:28,name:'pascal'},{id:29,name:'perl'},{id:30,name:'pgsql'},{id:31,name:'php'},{id:32,name:'plaintext'},{id:33,name:'postiats'},{id:34,name:'powerquery'},{id:35,name:'powershell'},{id:36,name:'pug'},{id:37,name:'python'},{id:38,name:'r'},{id:39,name:'razor'},{id:40,name:'redis'},{id:41,name:'redshift'},{id:42,name:'ruby'},{id:43,name:'rust'},{id:44,name:'sb'},{id:45,name:'scheme'},{id:46,name:'scss'},{id:47,name:'shell'},{id:48,name:'sol'},{id:49,name:'sql'},{id:50,name:'st'},{id:51,name:'swift'},{id:52,name:'tcl'},{id:53,name:'typescript'},{id:54,name:'vb'},{id:55,name:'xml'},{id:56,name:'yaml'}]

    const [state, setState] = useState({
        supportedLanguages: [{id: 1, name: "python"}, {id: 2, name: 'c++'}],
        language: 'python',
        cursorPosition: [1, 1]
    })

    const monacoRef = useRef(null)

    function handleEditorDidMount(editor, monaco) {
        editor.onMouseDown(() => {checkPosition()})
        editor.onKeyUp(() => {checkPosition()})
        monacoRef.current = editor; 
    }

    const changeLanguage = (e) => {
        setState(prev => {
            return {
                ...prev,
                language: e.target.value
            }
        })
    }

    const checkPosition = () => {
        setState(prev => {
            const position = monacoRef.current.getPosition()
            return {
                ...prev,
                cursorPosition: [position.lineNumber, position.column]
            }
        })
    }

    return (
        <Stack sx={{height:'100%', width: '100%', border:1, borderWidth: '1px', borderRadius: '12px', borderColor: '#aaa'}}>
            <Box sx={{height: '8%', width: '100%', px:2, backgroundColor: '#ddd', borderRadius: '12px 12px 0 0'}}>
                <Box sx={{height: '100%', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <Typography sx={{display: 'flex', alignItems: 'center'}}>
                        Code
                    </Typography>
                    <Box sx={{height: '100%'}}>
                        <Select
                            // labelId="demo-simple-select-filled-label"
                            // id="demo-simple-select-filled"
                            variant="standard"
                            value={state.language}
                            onChange={changeLanguage}
                            sx={{height: '100%'}}
                            inputProps={{style: {borderBottomWidth: '0px'}}}
                        >
                            {state.supportedLanguages.map(item => {
                                return (
                                    <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </Box>
                </Box>
            </Box>
            <Editor 
                height="90%" 
                width="100%" 
                language={state.language}
                defaultValue={codeTemplate}
                theme={'vs-light'}
                onMount={handleEditorDidMount}
            />
            <Typography component="span" sx={{display: 'flex', justifyContent: 'flex-end', px: 2, backgroundColor: '#ddd', borderRadius: '0 0 12px 12px'}}>
                {`Line: ${state.cursorPosition[0]}, Column: ${state.cursorPosition[1]}`}
            </Typography>
        </Stack>
    )
}

export default CodeEditor;