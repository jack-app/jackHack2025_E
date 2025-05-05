import { useState } from "react";
import "./App.css";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reasons, setReasons] = useState([]);
  const [cancelMessage, setCancelMessage] = useState(""); // ✅ キャンセル文

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
      setReasons([]);
      setCancelMessage("");
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    setReasons([]);
    setCancelMessage(""); // reset

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
      console.log(data.message.message);
      setCancelMessage(data.message.message); // ← FastAPI 側が {"message": "..."} を返すことが前提
    } catch (err) {
      console.error("キャンセル文章生成失敗:", err);
    }
  };

  return (
    <>
      <div className="header">キャンセル代行CanCan</div>
      <div className="body">
        <div className="main">
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
                        <button onClick={() => handleReasonClick(reason)}>
                          {reason}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {cancelMessage && (
                    <div className="cancel-message">
                      <h4>生成されたキャンセル文章</h4>
                      <p>{cancelMessage}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <p>a------</p>
              <button className="GObutton" onClick={handleLogin}>
                GO（Googleログイン）
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
