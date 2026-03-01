import { useState, useRef } from 'react';

function Signup({ onAuthSuccess }) {
    const name = useRef("");
    const email = useRef("");
    const password = useRef("");
    const [error, setError] = useState("");
    async function signup() {
        const res = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            credentials: "include",
            body: JSON.stringify({
                name: name.current.value,
                email: email.current.value,
                password: password.current.value
            })
        })
        const data = await res.json();
        console.log(data);
        setError(data.message);

        if (res.ok) {
            onAuthSuccess();
        }
    }
    return <>
        <h3>Signup</h3>
        <p>Name</p>
        <input type="text" ref={name} />
        <p>Email</p>
        <input type="email" ref={email} />
        <p>Password</p>
        <input type="password" ref={password} />
        <br />
        <br />
        <br />
        <button onClick={() => { signup() }}>Signup</button>
        <br />
        {error}
    </>
}

export default Signup;