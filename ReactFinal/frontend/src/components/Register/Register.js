import { useState, useRef } from 'react';

import ReCAPTCHA from "react-google-recaptcha";
import styles from './Register.module.css'

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);

    const reCaptchaRef = useRef();

    async function Register(e){
        e.preventDefault();
        console.log("sdadsa")
        const token = await reCaptchaRef.current.executeAsync();
        console.log(token)

        const CSRFres = await fetch("http://localhost:3001/getCSRFToken", {
            credentials: "include",
            });
        console.log("asdad")
        const CSRFtoken = await CSRFres.json();
        console.log("asdad")

        const res = await fetch("http://localhost:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-Token': CSRFtoken.CSRFToken
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password,
                captchaToken: token
            })
        });
        console.log("asdad")
        const data = await res.json();
        console.log("asdad")
        if(data._id !== undefined){
            window.location.href="/";
        }
        else{
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    return(
        <>
            <div className={styles['top-container']}>
                <div className={styles['title']}>
                    <h2>Register:</h2>
                </div>
            </div>
            <div className={styles['register-container']}>
                <div className={styles['register-info']}>
                    <form className={styles['form-group']} onSubmit={Register}>
                    <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>(setEmail(e.target.value))} />
                    <input type="text" name="username" placeholder="Username" value={username} onChange={(e)=>(setUsername(e.target.value))}/>
                    <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>(setPassword(e.target.value))} />
                    <input type="submit" name="submit" value="Register" />
                    <label>{error}</label>
                    </form>
                </div>
            </div>
            <ReCAPTCHA
                sitekey='6LfOb9YpAAAAAK8Sg1QJCDQoEcQGSUV_N1nFIDcW'
                size='invisible'
                ref={reCaptchaRef}
            />
        </>
    );
}

export default Register;