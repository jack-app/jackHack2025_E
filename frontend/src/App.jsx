import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
<div class="header">キャンセル代行CanCan</div>
<div class="body">
    <div class="main">
    <p>a------</p>
    </div>
    <div class="setting">
      <button class="GObutton">GO</button>
    </div>
</div>
    </>
  )
}

export default App
