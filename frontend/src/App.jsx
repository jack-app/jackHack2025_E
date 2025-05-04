import { React, useState } from 'react'
import './App.css'
import { Button,TextField } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <>
   
<div class="header">キャンセル代行CanCan</div>
<div class="body">
    <div class="main">
    <TextField
      id="standard-basic" label="キャンセルしたい予定を入力" variant="standard" multiline maxRows={4}
      sx={{position:'absolute',
        width:'500px',
        left: '10%',
        bottom : '5%',
        backgroundColor: '#f9f9f9',}}>
    </TextField>
    <Button variant="contained"
      sx={{ position: 'absolute',
            bottom: '5%',
            left:'50%',
      }}>
      送信
    </Button>
    </div>
    <div class="setting">
      <button class="GObutton">GO</button>
    </div>
</div>
    </>
  )
}

export default App
