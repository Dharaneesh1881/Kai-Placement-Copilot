import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";
function App() {
  const [login,setlogin]=useState(false);
  return <>
  <h1>Kai Placement Copilot</h1>
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
