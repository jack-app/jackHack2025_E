// App.jsx
import { useState } from "react";
import "./App.css";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("ログイン失敗:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("ログアウト失敗:", err);
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
