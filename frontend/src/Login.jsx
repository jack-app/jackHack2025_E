import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <p>{user.displayName} ????????</p>
          <img src={user.photoURL} width="100" alt="profile" />
          <br />
          <button onClick={handleLogout}>?????</button>
        </>
      ) : (
        <button onClick={handleLogin}>Google?????</button>
      )}
    </div>
  );
};

export default Login;
