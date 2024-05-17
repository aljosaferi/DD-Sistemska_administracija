import { useContext, useState } from 'react';
import { UserContext } from '../../userContext';
import { Navigate } from 'react-router-dom';

import styles from './Login.module.css'

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();

        const CSRFres = await fetch("http://" + process.env.REACT_APP_IP_ADDY + ":3001/getCSRFToken", {
            credentials: "include",
        });
        const CSRFtoken = await CSRFres.json();

        const res = await fetch("http://" + process.env.REACT_APP_IP_ADDY + ":3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-Token': CSRFtoken.CSRFToken
            },
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
        <>
            <div className={styles['top-container']}>
                <div className={styles['title']}>
                    <h2>Login:</h2>
                </div>
            </div>
            <div className={styles['login-container']}>
                <div className={styles['login-info']}>
                    <form className={styles['form-group']} onSubmit={Login}>
                        {userContext.user ? <Navigate replace to="/" /> : ""}
                        <input type="text" name="username" placeholder="Username"
                        value={username} onChange={(e)=>(setUsername(e.target.value))}/>
                        <input type="password" name="password" placeholder="Password"
                        value={password} onChange={(e)=>(setPassword(e.target.value))}/>
                        <input type="submit" name="submit" value="Log in"/>
                        <label>{error}</label>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;