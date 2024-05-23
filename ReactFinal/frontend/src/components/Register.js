import { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

import classes from './Register.module.css';

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);
    const [captchaValue, setCaptchaValue] = useState(null);

    async function Register(e){
        e.preventDefault();
        if(captchaValue === null) {
            setError("Please verify the CAPTCHA");
            return;
        }
        const res = await fetch("http://localhost:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                captcha: captchaValue
            })
        });
        const data = await res.json();
        if(data._id !== undefined){
            window.location.href="/";
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setCaptchaValue(null);
            setError("Registration failed");
        }
    }

    return(
        <div className={classes.container}>
            <h1>Sign Up</h1>
            <p>Create your account</p>
            <form onSubmit={Register} className={classes.form}>
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>(setEmail(e.target.value))} className={classes.inputField} />
                <input type="text" name="username" placeholder="Username" value={username} onChange={(e)=>(setUsername(e.target.value))} className={classes.inputField} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>(setPassword(e.target.value))} className={classes.inputField} />
                <ReCAPTCHA sitekey="6LeYlM8pAAAAABHLoaRalxkgoGvOHnHSEC4-xqs2" onChange={value => setCaptchaValue(value)} className={classes.recaptcha} />
                <input type="submit" name="submit" value="Login" className={classes.submitButton} />
                <label>{error}</label>
            </form>
        </div>
    );
}

export default Register;