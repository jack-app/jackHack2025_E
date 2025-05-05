import { React, useState } from "react";
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
  const [cancelMessage, setCancelMessage] = useState("");
  const [aite, setAite] = useState("");
  const [attitudes, setAttitudes] = useState("");
  const [refinedMessage, setRefinedMessage] = useState(""); // 生成後のリライト文章

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
  const handleFeedback = async () => {
    if (!selectedEvent || !cancelMessage || !aite || !attitudes) {
      alert(
        "相手、態度、キャンセル文章、予定がすべて入力されている必要があります"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/cancel/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_text: cancelMessage,
          schedule: selectedEvent.summary,
          aite: aite,
          attitudes: attitudes,
        }),
      });

      const data = await res.json();
      setRefinedMessage(data.message);
    } catch (err) {
      console.error("リライト文章生成失敗:", err);
      alert("リライト生成に失敗しました");
    }
  };


  // ✅ 理由を選んだとき、キャンセル文を生成
  const handleReasonClick = async (reason) => {
    if (!selectedEvent) return;

    try {
      const res = await fetch("http://localhost:8000/cancel/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schedule: selectedEvent.summary,
          reason: reason,
        }),
      });

      const data = await res.json();
      console.log(data);
      setCancelMessage(data.message.message); // ← FastAPI 側が {"message": "..."} を返すことが前提
      } catch (err) {
      console.error("キャンセル文章生成失敗:", err);
      }
      };

  return (
    <>
   <div className="header">
   <img src={logo} className="logo" alt="logo" />
    {/* キャンセル代行CanCan */}
    </div>
      <div className="body">
        <div className="main">
        {user ? (
        <>
          <p>{user.displayName}さんでログイン中</p>
          <img src={user.photoURL} width="80" alt="profile" />
          <br />
          <button className="GObutton" onClick={handleLogout}>ログアウト</button>
        </>
      ) : (
        <button onClick={handleLogin}>Googleでログイン</button>
      )}          
        {user ? (
            <>
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
                        <button onClick={() => handleReasonClick(reason)}>{reason}</button>
                      </li>
                    ))}
                  </ul>
                </div>
            )}
              {cancelMessage && (
                    <div className="cancel-message">
                      <h4>生成されたキャンセル文章</h4>
                      <p>{cancelMessage}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard
                            .writeText(cancelMessage)
                            .then(() => alert("コピーしました！"))
                            .catch(() => alert("コピーに失敗しました"));
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "8px",
                          cursor: "pointer",
                        }}
                      >
                        コピーする
                      </button>
                    </div>
                  )}
                  {cancelMessage && (
                    <div style={{ marginTop: "20px" }}>
                      <h4>文章を相手・態度に合わせて書き換える</h4>
                      <label>
                        相手:{" "}
                        <input
                          type="text"
                          value={aite}
                          onChange={(e) => setAite(e.target.value)}
                          placeholder="例: 上司, 友達"
                        />
                      </label>
                      <br />
                      <label>
                        態度（カンマ区切り）:{" "}
                        <input
                          type="text"
                          value={attitudes}
                          onChange={(e) => setAttitudes(e.target.value)}
                          placeholder="例: 丁寧,申し訳なさ強め"
                        />
                      </label>
                      <br />
                      <button
                        onClick={handleFeedback}
                        style={{
                          marginTop: "10px",
                          padding: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Feedbackで書き換え
                      </button>
                    </div>
                  )}
                  {refinedMessage && (
                    <div
                      className="refined-message"
                      style={{ marginTop: "20px" }}
                    >
                      <h4>書き換え後の文章</h4>
                      <p>{refinedMessage}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard
                            .writeText(refinedMessage)
                            .then(() => alert("コピーしました！"))
                            .catch(() => alert("コピーに失敗しました"));
                        }}
                      >
                        コピーする
                      </button>
                    </div>
                  )}
            </>
          ) : (
            <>
            

            </>
          )}
        </div>
        </div>
    </>
  );
}

export default App;
