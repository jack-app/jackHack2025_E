import { useState, React } from 'react'
import './App.css'
import {Button,TextField,Checkbox, FormGroup, FormControlLabel, FormLabel} from '@mui/material';
import logo from './assets/CanCan.png'

function App() {
  const [count, setCount] = useState(0)
 
  return (
    <>

<div class="header">
  <img src={logo} class="logo" alt="logo" />
  {/* キャンセル代行CanCan */}
</div>
<div class="body">
    <div class="main">
    <Button variant="contained"
    style={{fontSize: '30px'}}
    sx={{
      position: 'absolute',
      right: '50%',
      top: '10%',
      width: '500px',
      height: '50px',
    }}
    >
    カレンダーから予定を取得
    </Button>
    </div>
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
        <form>
          <fieldset>
            <legend>態度</legend>
          <div>
            <input type="checkbox" name="attitude" id="atti_1" />
            <label for="atti_1">丁寧</label>
          </div>
          <div>
            <input type="checkbox" name="attitude" id="atti_2" />
            <label for="atti_2">カジュアル</label>
          </div>
          <div>
            <input type="checkbox" name="attitude" id="atti_3" />
            <label for="atti_3">申し訳なさ強め</label>
          </div>
          <div>
            <input type="checkbox" name="attitude" id="atti_4" />
            <label for="atti_4">ややおびえる感じ</label>
          </div>
          <div>
            <input type="checkbox" name="attitude" id="atti_5" />
            <label for="atti_5">すごく反省している感じ</label>
          </div>
          <div>
            <input type="checkbox" name="attitude" id="atti_6" />
            <label for="atti_6">まったく反省していない感じ</label>
          </div>
          <div>
            <input type="checkbox" name="attitude" id="atti_7" />
            <label for="atti_7">傲慢で見下す感じ</label>
          </div>
          </fieldset>
        </form>
        {/* <FormLabel component="legend">態度</FormLabel>
        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="丁寧"/>
          <FormControlLabel control={<Checkbox />} label="カジュアル"/>
          <FormControlLabel control={<Checkbox />} label="申し訳なさ強め"/>
          <FormControlLabel control={<Checkbox />} label="ややおびえる感じ"/>
          <FormControlLabel control={<Checkbox />} label="すごく反省している感じ"/>
          <FormControlLabel control={<Checkbox />} label="まったく反省していない感じ"/>
          <FormControlLabel control={<Checkbox />} label="傲慢で見下す感じ"/>
        </FormGroup> */}
        <button class="GObutton">GO</button>
      </div>
    </div>
    </>
  )
}

export default App
