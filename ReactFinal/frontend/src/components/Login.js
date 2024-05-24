import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

import classes from './Login.module.css';

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <div className={classes.container}>
            <h1>Welcome Back</h1>
            <p>Enter your credentials to log in</p>
            <form onSubmit={Login} className={classes.form}>
                {userContext.user ? <Navigate replace to="/" /> : ""}
                <input type="text" name="username" placeholder="Username"
                    className={classes.inputField}
                    value={username} onChange={(e)=>(setUsername(e.target.value))}/>
                <input type="password" name="password" placeholder="Password"
                    className={classes.inputField}
                    value={password} onChange={(e)=>(setPassword(e.target.value))}/>
                <input type="submit" name="submit" value="Log in"
                    className={classes.submitButton}/>
                 <label>{error}</label>
            </form>
        </div>
    );
}

export default Login;