import { React, useState } from 'react'
import './App.css'
import { Button,TextField } from '@mui/material'
import {google_calendar} from 'backend/google_calendar.py'

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <>
   
<div class="header">キャンセル代行CanCan</div>
<div class="body">
    <div class="main">
    <Button variant="contained" onClick={google_calendar}>
    予定を取得
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
