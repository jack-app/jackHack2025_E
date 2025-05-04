import { useState, React } from 'react'
import './App.css'
import {Checkbox, FormGroup, FormControlLabel, FormLabel} from '@mui/material';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="header">
        {/* <img src="./assets/react.svg" alt="logo" height="10vh"/> */}
        キャンセル代行CanCan
      </div>
      <div class="body">
        <div class="main">
          <p>a------</p>
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
