import { useState, React } from 'react'
import './App.css'
import {Button,TextField,Checkbox, FormGroup, FormControlLabel, FormLabel} from '@mui/material';

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
    <FormLabel component="legend">態度</FormLabel>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="丁寧"/>
            <FormControlLabel control={<Checkbox />} label="カジュアル"/>
            <FormControlLabel control={<Checkbox />} label="申し訳なさ強め"/>
            <FormControlLabel control={<Checkbox />} label="ややおびえる感じ"/>
            <FormControlLabel control={<Checkbox />} label="すごく反省している感じ"/>
            <FormControlLabel control={<Checkbox />} label="まったく反省していない感じ"/>
            <FormControlLabel control={<Checkbox />} label="傲慢で見下す感じ"/>
          </FormGroup>
      <button class="GObutton">GO</button>
    </div>
</div>
    </>
  )
}

export default App
