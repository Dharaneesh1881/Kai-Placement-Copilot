import { useState,useRef } from "react";

function Login(){
    const username = useRef("");
    const password = useRef("");
    async function login(){
        const res = await fetch("http://localhost:3000/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token"),
            },
            credentials:"include",
            body:JSON.stringify({
                username:username.current.value,
                password:password.current.value
            })
        })
        const data = await res.json();
        console.log(data);
    }
    return <>
    <div>      
        <h1>username</h1>
        <input type="text" ref={username} />  
        <h1>password</h1>
        <input type="password" ref={password} />  
        <br/>
        <br/>
        <br/>
        <button onClick={() => {console.log(username.current.value,password.current.value)}}>Login</button>
    </div>
    </>
}

export default Login;