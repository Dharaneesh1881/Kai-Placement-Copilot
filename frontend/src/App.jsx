import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Login from './login';
function App() {
  return <>
    <h1>Kai Placement Copilot</h1>
    <Login />
    <GoogleLogin
      onSuccess={res => {
        console.log(res);
        console.log(jwtDecode(res.credential));
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  </>
}

export default App
