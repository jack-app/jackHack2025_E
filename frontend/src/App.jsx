import { useState } from "react";
import "./App.css";
import {Button,TextField,Checkbox, FormGroup, FormControlLabel, FormLabel} from '@mui/material';
import logo from './assets/CanCan.png'
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 追加：選択中のイベント
  const [reasons, setReasons] = useState([]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      fetchCalendarEvents();
    } catch (err) {
      console.error("ログイン失敗:", err);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch("http://localhost:8000/calendar/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("予定取得失敗:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEvents([]);
      setSelectedEvent(null);
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setReasons([]); // 前の理由をクリア

    try {
      const res = await fetch("http://localhost:8000/cancel/reasons/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schedule: event.summary }),
      });

      const data = await res.json();
      setReasons(data);
    } catch (err) {
      console.error("キャンセル理由取得失敗:", err);
    }
  };

  return (
    <>
   <div class="header">
   <img src={logo} class="logo" alt="logo" />
    {/* キャンセル代行CanCan */}
    </div>
      <div className="body">
        <div className="main">
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
          {user ? (
            <>
              <p>{user.displayName} さんでログイン中</p>
              <img src={user.photoURL} alt="profile" width="80" />
              <br />
              <button className="GObutton" onClick={handleLogout}>
                ログアウト
              </button>

              <div className="event-list">
                <h3>予定一覧</h3>
                <ul>
                  {events.map((event, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleSelectEvent(event)}
                        style={{ margin: "5px", padding: "8px" }}
                      >
                        {event.start} - {event.summary}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedEvent && (
                <div className="selected-event">
                  <h4>選択された予定</h4>
                  <p>
                    {selectedEvent.start} - {selectedEvent.summary}
                  </p>

                  <h4>キャンセル理由候補</h4>
                  <ul>
                    {reasons.map((reason, idx) => (
                      <li key={idx}>
                        <button>{reason}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
            
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
        <button class="GObutton">GO</button>
      </div>
    </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
