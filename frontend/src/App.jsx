import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Login from './login';
import Signup from './signup';
import Home from './home';

function App() {
  const [isHome, setIsHome] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  if (isHome) {
    return <Home />;
  }

  return <>
    <h1>Kai Placement Copilot</h1>
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={() => { setShowLogin(true) }}>Login</button>
      <button onClick={() => { setShowLogin(false) }}>Signup</button>
    </div>

    {showLogin ?
      <Login onAuthSuccess={() => setIsHome(true)} /> :
      <Signup onAuthSuccess={() => setIsHome(true)} />
    }

    <GoogleLogin
      onSuccess={res => {
        console.log(res);
        console.log(jwtDecode(res.credential));
        setIsHome(true);
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  </>
}

export default App;
