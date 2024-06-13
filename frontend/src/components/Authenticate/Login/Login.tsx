import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../userContext';
import axios from 'axios';

import Button from '../../Button/Button';
import { postApiCall } from '../../../api/apiCalls';

import styles from './Login.module.scss';


interface LoginProps {
    handleClose: () => void;
}


function Login({ handleClose }, LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext); 

    async function Login(e){
        e.preventDefault();

        const user = {
            username: username,
            password: password
        }

        try {

            const data = await postApiCall(`http://${process.env.REACT_APP_URL}:3001/users/login`, user)

            if(data._id !== undefined){
                userContext.setUserContext(data);
                handleClose()
            } else {
                setUsername("");
                setPassword("");
                setError("Something went wrong");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    }

    return (
        <div className={styles['container']}>
            <form onSubmit={Login}>
                <div className={styles['username-container']}>
                    <input
                        type="text"
                        id="username"
                        placeholder="Uporabniško ime"
                        onChange={(e)=>(setUsername(e.target.value))}
                        required
                    />
                </div>
                <div className={styles['password-container']}>
                    <input
                        type="password"
                        id="password"
                        placeholder="Geslo"
                        onChange={(e)=>(setPassword(e.target.value))}
                        required
                    />
                </div>
                <label className={styles['error']}>
                    {error}
                </label>
                <div className={styles['submit-container']}>
                    <Button type="primary" width={"100%"} padding={'1rem'}>
                        Prijavi se
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Login;