import { React, useState } from "react";
import "./App.css";
import { Button, Avatar, Box, Grid, Typography, TextField } from "@mui/material";
import logo from './assets/CanCan.png'
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reasons, setReasons] = useState([]);
  const [cancelMessage, setCancelMessage] = useState("");
  const [aite, setAite] = useState("");
  const [attitudes, setAttitudes] = useState("");
  const [refinedMessage, setRefinedMessage] = useState("");

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
    setReasons([]);

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
      setCancelMessage(data.message.message); 
    } catch (err) {
      console.error("キャンセル文章生成失敗:", err);
    }
  };

  // チェックボックスの状態を追跡するためのステート
  const [selectedAttitudes, setSelectedAttitudes] = useState([]);

  // チェックボックスが変更されたときの処理
  const handleAttitudeChange = (event) => {
    const { id, checked } = event.target;
    const attitudeLabels = {
      atti_1: "丁寧",
      atti_2: "カジュアル",
      atti_3: "申し訳なさ強め",
      atti_4: "ややおびえる感じ",
      atti_5: "すごく反省している感じ",
      atti_6: "まったく反省していない感じ",
      atti_7: "傲慢で見下す感じ",
    };

    // 選択された態度ラベルを選択リストに追加/削除
    setSelectedAttitudes((prevSelected) => {
      const attitude = attitudeLabels[id];
      if (checked) {
        return [...prevSelected, attitude];
      } else {
        return prevSelected.filter((attitude) => attitude !== attitudeLabels[id]);
      }
    });
  };

  // 「GO」ボタンが押されたときの処理
  const handleGOButtonClick = () => {
    setAttitudes(selectedAttitudes.join(", "));
  };

  return (
    <>
      <div className="header">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <div className="body">
        <div className="main">
          {user && (
            <>
              <div className="event-list">
                <Grid
                  backgroundColor={"#ccc"}
                  margin={"10px"}
                  width={"140px"}
                  textAlign={"center"}
                  sx={{left: "5%", top: "10vh" }}
                >
                  <Typography color="#010101" fontSize={"1.4rem"} fontFamily={"Zen Maru Gothic"} fontWeight={"bold"} margin={"5px"}>
                    予定一覧
                  </Typography>
                </Grid>
                <ul>
                  {events.map((event, idx) => (
                    <li key={idx}>
                      <Button
                        variant="contained"
                        onClick={() => handleSelectEvent(event)}
                        style={{ margin: "1px", padding: "10px" }}
                      >
                        {event.start} - {event.summary}
                      </Button>
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
                </div>
              )}
              {cancelMessage && (
                <div className="cancel-message">
                  <h4>生成されたキャンセル文章</h4>
                  <br />
                  <p>{cancelMessage}</p>
                  <Button
                    variant="contained"
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
                  </Button>
                </div>
              )}

              {cancelMessage && (
                <div class="rewrite">
                  <Box color={"#fefefe"}  padding="10px" borderRadius='12px' backgroundColor="#1976d2" width={"450px"}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>文章を相手・態度に合わせて書き換える</p>
                  <label className="aite">
                    <p>相手 :{" "}</p>
                    <TextField
                      sx={{
                        backgroundColor: '#f0f0f0', // 背景色
                        '& .MuiInputBase-input::placeholder': {
                          color: '#333', // プレースホルダーの色
                          opacity: 1,       // 薄くならないように
                        },
                      
                          // 通常時の枠線
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#ccc', // 通常の枠線色
                            },
                      }}}
                      backgroundColor="#fefefe"
                      type="text"
                      value={aite}
                      onChange={(e) => setAite(e.target.value)}
                      placeholder="例: 上司, 友達"
                    />
                  </label>
                  <br />
                  <label className="taido">
                    <p>態度（カンマ区切り）:{" "}</p>
                    <TextField
                    sx={{
                      backgroundColor: '#f0f0f0', // 背景色
                      '& .MuiInputBase-input::placeholder': {
                        color: '#333', // プレースホルダーの色
                        opacity: 1,       // 薄くならないように
                      },
                    
                        // 通常時の枠線
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#ccc', // 通常の枠線色
                          },
                    }}}
                      type="text"
                      value={attitudes}
                      onChange={(e) => setAttitudes(e.target.value)}
                      placeholder="例: 丁寧,申し訳なさ強め"
                    />
                  </label>
                  <button class="feedbackButton"  onClick={handleFeedback}>
                    Feedbackで書き換え
                  </button>
                  </Box>
                    {refinedMessage && (
                    <div
                      className="refined-message"
                    >
                      <h4>書き換え後の文章</h4>
                      <br />
                      <p>{refinedMessage}</p>
                      <Button
                        variant="contained"
                        onClick={() => {
                          navigator.clipboard
                            .writeText(refinedMessage)
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
                        
                      </Button>
                    </div>
                  )}
                </div>
              )}

            </>
          )}
        </div>
        <div className="side">
        {user ? (
            <>
              <Box
                color={"#111111"}
                fontSize={"15px"}
                sx={{
                  backgroundColor: "#e3e3e3",
                  // position: "absolute",
                  padding: "2px",
                  fontFamily: 'Zen Maru Gothic',
                  textAlign: "center",
                  width: "10vw",
                }}
              >
                {user.displayName}さんで<br />ログイン中
              </Box>
              <Avatar
                img src={user.photoURL}
                alt="profile"
                sx={{
                  width: 50,
                  height: 50,
                }}
              />
              <button className="logoutButton" onClick={handleLogout}>
                ログアウト
              </button>
            </>
          ) : (
            <button class="loginButton" onClick={handleLogin}>Googleでログイン</button>
          )}
          {cancelMessage && (
              <div className="setting">
                <form>
                  <fieldset>
                    <legend>態度</legend>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_1"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_1">丁寧</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_2"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_2">カジュアル</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_3"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_3">申し訳なさ強め</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_4"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_4">ややおびえる感じ</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_5"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_5">すごく反省している感じ</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_6"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_6">まったく反省していない感じ</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="atti_7"
                        onChange={handleAttitudeChange}
                      />
                      <label htmlFor="atti_7">傲慢で見下す感じ</label>
                    </div>
                  </fieldset>
                </form>
                <button class="sendButton" onClick={handleGOButtonClick}>設定</button>
              </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
