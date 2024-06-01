import { useState, useContext } from 'react';
import Button from '../../Button/Button';

import { UserContext } from '../../../userContext';

import styles from './Register.module.scss';
import { postApiCall } from '../../../api/apiCalls';
import axios from 'axios';

interface RegisterProps {
    switchToLogin: () => void;
}

function Register({ switchToLogin }, RegisterProps) {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRestaurantOwner, setIsRestaurantOwner]= useState(false);
    const [error, setError] = useState("");

    const userContext = useContext(UserContext); 

    async function Register(e){
        e.preventDefault();

        const user = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            userType: isRestaurantOwner ? "restaurantOwner" : "regular"
        }

        try {

            const data = await postApiCall(`http://${process.env.REACT_APP_URL}:3001/users`, user)

            if(data._id !== undefined){
                switchToLogin();
            } else {
                setUsername("");
                setFirstName("");
                setLastName("");
                setEmail("");
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
            <form onSubmit={Register}>
                <div className={styles['name-container']}>
                    <input
                        type="text"
                        id="name"
                        placeholder="Ime"
                        onChange={(e)=>(setFirstName(e.target.value))}
                        required
                    />
                    <input
                        type="text"
                        id="surname"
                        placeholder="Priimek"
                        onChange={(e)=>(setLastName(e.target.value))}
                        required
                    />
                </div>
                <div className={styles['username-container']}>
                    <input
                        type="text"
                        id="username"
                        placeholder="Uporabniško ime"
                        onChange={(e)=>(setUsername(e.target.value))}
                        required
                    />
                </div>
                <div className={styles['email-container']}>
                    <input
                        type="email"
                        id="email"
                        placeholder="elektronska pošta"
                        onChange={(e)=>(setEmail(e.target.value))}
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
                <div className={styles['restaurant-owner-container']}>
                    Lastnik Restavracije:
                    <label className={styles['switch']}>
                        <input type="checkbox" onChange={(e) => setIsRestaurantOwner(e.target.checked)} />
                        <span className={`${styles['slider']} ${styles['round']}`}/>
                    </label>
                </div>
                <label className={styles['error']}>
                    {error}
                </label>
                <div className={styles['submit-container']}>
                    <Button type="primary" width={"100%"} padding={'1rem'}>
                        Registriraj se
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Register;